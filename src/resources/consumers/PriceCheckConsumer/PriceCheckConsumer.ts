import DisqualifyingDataException from '@/utils/exceptions/DisqualifyingDataException';
import HttpException from '@/utils/exceptions/HttpException';
import DiscountService from '../../services/DiscountService';
import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';
import SqsMsgBody from './models/SqsMsgBody';
import CONSTANTS from '../../../Services/ServiceConstants';
import DataSource from 'datasource';
import StickerPriceService from 'Services/StickerPriceService/StickerPriceService';
import Discount from '@/resources/entities/discount/IDiscount';

class PriceCheckConsumer {

    private discountService: DiscountService;
    private stickerPriceService: StickerPriceService;
    private processingRecord: Map<string, Promise<void>>
    private sqsUrl: string;
    private capacity: number;
    private existingDiscountCik: Set<string>;

    constructor(dataSource: DataSource) {
        this.sqsUrl = process.env.discount_check_sqs_url ?? CONSTANTS.GLOBAL.EMPTY;
        this.discountService = dataSource.discountService;
        this.stickerPriceService = dataSource.stickerPriceService;
        this.processingRecord = new Map<string, Promise<void>>();
        this.capacity = 10;    
        this.existingDiscountCik = new Set<string>();  
        this.loadExistingDiscountCikSet();  
    }

    public async start(): Promise<void> {
        console.log('Initializing polling for price check consumer...');
        const app = Consumer.create({
            queueUrl: this.sqsUrl,
            handleMessage: async (message) => {
                console.log(`Message retrieved from SQS: ${JSON.stringify(message)}`)
                if (message.Body) {
                    const event: SqsMsgBody = JSON.parse(message.Body);
                    await this.processEvent(event);
                }
            },
            sqs: new SQSClient({
              region: 'us-east-1'
            })
          });

          app.updateOption('waitTimeSeconds', 20);
          app.updateOption('batchSize', 10);

          app.on('error', (err) => {
            console.error(err.message);
          });
          
          app.on('processing_error', (err) => {
            console.error(err.message);
          });
          
          app.start();
    }

    private async processEvent(event: SqsMsgBody): Promise<void> {
        event.Records.forEach(async record => {
            if (record.s3 && record.s3.object && record.s3.object.key) {
                const cik = this.removeS3KeySuffix(record.s3.object.key);
                await this.processCik(cik);
            }
        });
    }

    private async processCik(cik: string): Promise<void> {
        const processingCik = Object.keys(this.processingRecord);
        if (!processingCik.includes(cik)) {
            console.log(`In price check consumer, processing: ${cik}`);
            let atCapacity = processingCik.length === this.capacity;
            if (atCapacity) {
                console.log(`Awaiting completion of batch: ${this.processingRecord}`)
                await Promise.all(this.processingRecord.values());
            }
            this.processingRecord.set(cik, this.intiateDiscountCheck(cik));
        }
    }

    private async intiateDiscountCheck(cik: string): Promise<void> {
        try {
            await this.checkForDiscount(cik);
        } catch (err: any) {
            if (err instanceof DisqualifyingDataException &&
                this.existingDiscountCik.has(cik)) {
                await this.deleteDiscount(cik, err.message);
            }
            console.log(`Error occurred while checking ${cik} for discount: ${err.message}`);
        }
        this.processingRecord.delete(cik);
    }

    private async checkForDiscount(cik: string): Promise<void> {
        console.log("In discount service checking for a discount on CIK: " + cik);
        return this.stickerPriceService.checkForSale(cik)
            .then(async (discount: Discount) => {
                return this.saveDiscount(discount); 
            });
    }

    private async saveDiscount(discount: Discount): Promise<void> {
        const cik = discount.cik;
        return this.discountService.save(discount)
            .then(response => {
                if (response.includes('Success')) {
                    this.existingDiscountCik.add(cik);
                    console.log("Sticker price sale saved for cik: " + cik);
                } else {
                    console.log("Sticker price save failed for cik: " + cik + " with response: " + response);
                }
            }).catch((err: any) => {
                console.log("Sticker price save failed for cik: " + cik + " with err: " + err);
            });
    }

    private async deleteDiscount(cik: string, reason: string): Promise<void> {
        this.discountService.delete(cik)
            .then(() => {
                console.log(`Discount for ${cik} has been deleted due to: ${reason}`);
                this.existingDiscountCik.delete(cik);
            }).catch((deleteEx: HttpException) => {
                if (deleteEx.status !== 404) {
                    console.log(`Deleting discount for ${cik} failed due to: ${deleteEx.message}`);
                } else {
                    console.log(`Discount for ${cik} does not exist`);
                }
            })
    }

    private async loadExistingDiscountCikSet(): Promise<void> {
        this.discountService.getBulkSimpleDiscounts()
            .then(async simpleDiscounts => {
                simpleDiscounts.forEach(simpleDiscount => {
                    this.existingDiscountCik.add(simpleDiscount.cik);
                });
                console.log('Existing discount cik successfully loaded!');
            }).catch((err: HttpException) => {
                console.log(`Error occurred while initializing existing discount set: ${err.message}`);
            });
    }

    private removeS3KeySuffix(key: string): string {
        return key.slice(0, -5);
    }
}


export default PriceCheckConsumer;