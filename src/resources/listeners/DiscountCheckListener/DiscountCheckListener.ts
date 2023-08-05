import DisqualifyingDataException from '@/utils/exceptions/DisqualifyingDataException';
import HttpException from '@/utils/exceptions/HttpException';
import DiscountService from '../../services/DiscountService';
import Listener from '@/utils/interfaces/IListener';
import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';
import SqsMsgBody from './models/SqsMsgBody';
import CONSTANTS from '../../../Services/ServiceConstants';

class DiscountCheckListener implements Listener {

    private discountService: DiscountService;
    private processingCik: Set<string>;
    private sqsUrl: string;

    constructor() {
        console.log('Initializing discount check listener...');
        this.sqsUrl = process.env.discount_check_sqs_url ?? CONSTANTS.GLOBAL.EMPTY;
        this.discountService = new DiscountService();
        this.processingCik = new Set<string>();
    }

    public async listen(): Promise<void> {
        const app = Consumer.create({
            queueUrl: this.sqsUrl,
            handleMessage: async (message) => {
                console.log(`Polled message from SQS: ${message}`)
                if (message.Body) {
                    const event: SqsMsgBody = JSON.parse(message.Body);
                    event.Records.forEach(record => {
                        if (record.s3 && record.s3.object && record.s3.object.key) {
                            const cik = this.removeS3KeySuffix(record.s3.object.key);
                            this.processingCik.add(cik);
                            this.checkForDiscount(cik);
                        }
                    });
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

    private async checkForDiscount(cik: string): Promise<void> {
        try {
            await this.discountService.checkForDiscount(cik);
        } catch (err: any) {
            if (err instanceof DisqualifyingDataException) {
                await this.discountService.delete(cik)
                    .then(() => {
                        console.log(`Discount for ${cik} has been deleted due to: ${err.message}`);
                    }).catch((deleteEx: HttpException) => {
                        if (deleteEx.status !== 404) {
                            console.log(`Deleting discount for ${cik} failed due to: ${deleteEx.message}`);
                        } else {
                            console.log(`Discount for ${cik} does not exist`);
                        }
                    });
            }
            console.log(`Error occurred while checking ${cik} for discount: ${err.message}`);
        }
        this.processingCik.delete(cik);
    }

    private removeS3KeySuffix(key: string): string {
        return key.slice(0, -5);
    }
}


export default DiscountCheckListener;