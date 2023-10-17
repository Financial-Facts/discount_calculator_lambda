import { Consumer } from 'sqs-consumer';
import { SQSClient, Message } from '@aws-sdk/client-sqs';
import { SqsMsgBody } from './price-check.typings';
import DiscountManager from './discount-manager/discount-manager';
import CONSTANTS from '@/resources/resource.contants';
import { removeS3KeySuffix, sleep, watchForEmptyQueue } from '../resource.utils';

class PriceCheckConsumer {

    private batchCapacity = +(process.env.price_check_consumer_capacity ?? 1);
    private frequency = +(process.env.price_check_consumer_frequency ?? 1);

    private sqsUrl = process.env.discount_check_sqs_url ?? CONSTANTS.GLOBAL.EMPTY;
    private discountManager: DiscountManager;

    constructor() {
        this.discountManager = new DiscountManager();
    }

    public async startPolling(): Promise<void> {
        console.log('Initializing polling for price check consumer...');
        const app = this.buildConsumer();
        app.start();
        return watchForEmptyQueue(app);
    }

    private buildConsumer(): Consumer {
        return Consumer.create({
            queueUrl: this.sqsUrl,
            handleMessageBatch: async messages => this.handleMessageBatch(messages),
            sqs: new SQSClient({
                region: 'us-east-1'
            }),
            'waitTimeSeconds': 20,
            'batchSize': this.batchCapacity,
        }).on('error', (err) => {
            console.error(err.message);
        }).on('processing_error', (err) => {
            console.error(err.message);
        })
    }

    private async handleMessageBatch(messages: Message[]): Promise<void> {
        const processing: Promise<void>[] = [];
        for (let message of messages) {
            console.log(`Message retrieved from SQS: ${JSON.stringify(message)}`)
            if (message.Body) {
                try {
                    const event: SqsMsgBody = JSON.parse(message.Body);
                    processing.push(this.processSqsEvent(event));
                } catch (err: any) {
                    const cik = message.Body;
                    processing.push(this.discountManager.intiateDiscountCheck(cik));
                }
            }
        }
        await Promise.all(processing);
        await sleep(1000 * this.frequency);
    }

    private async processSqsEvent(event: SqsMsgBody): Promise<void> {
        for (let record of event.Records) {
            if (record.s3 && record.s3.object && record.s3.object.key) {
                const cik = removeS3KeySuffix(record.s3.object.key);
                console.log(`In price check consumer, processing: ${cik}`);
                return this.discountManager.intiateDiscountCheck(cik);
            }
        }
    }

}


export default PriceCheckConsumer;
