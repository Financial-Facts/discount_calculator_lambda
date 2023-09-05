import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';
import CONSTANTS from '../../../Services/ServiceConstants';
import { SqsMsgBody } from './PriceCheckConsumer.typings';
import DiscountManager from './backlog-manager/DiscountManager';

class PriceCheckConsumer {

    private batchCapacity = +(process.env.price_check_consumer_capacity ?? 2);
    private frequency = +(process.env.price_check_consumer_frequency ?? 1);

    private sqsUrl = process.env.discount_check_sqs_url ?? CONSTANTS.GLOBAL.EMPTY;
    private discountManager: DiscountManager;


    constructor() {
        this.discountManager = new DiscountManager();
    }

    public async startPolling(): Promise<void> {
        console.log('Initializing polling for price check consumer...');
        const app = Consumer.create({
            queueUrl: this.sqsUrl,
            handleMessageBatch: async messages => {
                const processing: Promise<void>[] = [];
                for (let message of messages) {
                    console.log(`Message retrieved from SQS: ${JSON.stringify(message)}`)
                    if (message.Body) {
                        try {
                            const event: SqsMsgBody = JSON.parse(message.Body);
                            processing.push(this.processEvent(event));
                        } catch (err: any) {
                            const cik = message.Body;
                            processing.push(this.discountManager.intiateDiscountCheck(cik));
                        }
                    }
                }
                await Promise.all(processing);
                await new Promise(f => setTimeout(f, 1000 * this.frequency));
            },
            sqs: new SQSClient({
              region: 'us-east-1'
            })
          });

          app.updateOption('waitTimeSeconds', 20);
          app.updateOption('batchSize', this.batchCapacity);

          app.on('error', (err) => {
            console.error(err.message);
          });
          
          app.on('processing_error', (err) => {
            console.error(err.message);
          });
          
          app.start();
    }

    private async processEvent(event: SqsMsgBody): Promise<void> {
        for (let record of event.Records) {
            if (record.s3 && record.s3.object && record.s3.object.key) {
                const cik = this.removeS3KeySuffix(record.s3.object.key);
                console.log(`In price check consumer, processing: ${cik}`);
                return this.discountManager.intiateDiscountCheck(cik);
            }
        }
    }

    private removeS3KeySuffix(key: string): string {
        return key.slice(0, -5);
    }

}


export default PriceCheckConsumer;
