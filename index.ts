import 'module-alias/register';
import bootstrap, { discountManager } from './src/bootstrap';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { removeS3KeySuffix, sleep } from '@/resources/resource.utils';
import { SqsMsgBody } from './src/types';
import CONSTANTS from '@/resources/resource.contants';

let frequency: number;

export const handler = async (event: SQSEvent): Promise<void> => {
    console.log(`Recieved event: ${JSON.stringify(event)}`);
    bootstrap();
    frequency = +(process.env.price_check_consumer_frequency ?? 1);

    for(let record of event.Records) {
        try {
            const message: SqsMsgBody = JSON.parse(record.body);
            await processSqsEvent(message);
        } catch (err: any) {
            if (err instanceof SyntaxError) {
                await processTestEvent(record);                
            }
        }
        await sleep(1000 * frequency);
    };

    console.log('Processing complete!');
};

async function processSqsEvent(event: SqsMsgBody): Promise<void> {
    for (let record of event.Records) {
        if (record.body) {
            const body = JSON.parse(record.body) as { cik: string };
            const cik = removeS3KeySuffix(body.cik);
            console.log(`In price check consumer, processing: ${cik}`);
            return discountManager.intiateDiscountCheck(cik);
        }
    }
}

async function processTestEvent(record: SQSRecord): Promise<void> {
    const cikList = record.body
        .split(CONSTANTS.GLOBAL.NEW_LINE)
        .map(raw => raw.trim())
        .filter(trimmed => trimmed !== CONSTANTS.GLOBAL.EMPTY);
    for (let cik of cikList) {
        await discountManager.intiateDiscountCheck(cik);
        await sleep(1000 * frequency);
    }
}
