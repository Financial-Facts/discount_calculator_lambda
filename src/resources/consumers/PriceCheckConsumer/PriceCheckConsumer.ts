import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';
import SqsMsgBody from './models/SqsMsgBody';
import CONSTANTS from '../../../Services/ServiceConstants';
import BacklogManager from './backlog-manager/BacklogManager';

class PriceCheckConsumer {

    private sqsUrl = process.env.discount_check_sqs_url ?? CONSTANTS.GLOBAL.EMPTY;
    private backlogManager: BacklogManager;

    constructor() {
        this.backlogManager = new BacklogManager();
    }

    public async startPolling(): Promise<void> {
        console.log('Initializing polling for price check consumer...');
        const app = Consumer.create({
            queueUrl: this.sqsUrl,
            handleMessage: async (message) => {
                console.log(`Message retrieved from SQS: ${JSON.stringify(message)}`)
                if (message.Body) {
                    const event: SqsMsgBody = JSON.parse(message.Body);
                    this.processEvent(event);
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
                this.backlogManager.addCikToBacklog(cik);
            }
        });
    }

    private removeS3KeySuffix(key: string): string {
        return key.slice(0, -5);
    }

}


export default PriceCheckConsumer;