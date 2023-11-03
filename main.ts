import CONSTANTS from "@/resources/resource.contants";
import EnvInitializationException from "@/utils/exceptions/EnvInitializationException";
import { SSM, GetParametersByPathResult } from "@aws-sdk/client-ssm";
import { SQSEvent } from "aws-lambda";
import { handler } from "index";

const event: SQSEvent = {
    "Records": [
        {
            "messageId": "562626f4-eba8-4141-b2f4-0b2376771399",
            "receiptHandle": "AQEBo732lRVkVonFOczaeUMpc6NcWJ/MVLZ5Uqkysp4rEmptW4NPCoTCzwA3CVkga6Uf3vR2cCnq1YgZLxF6r24oOs/SN/7+nt+TheA4TQlx6tSBJWMfcveFl6OE27r/dVEyvag1fs0oFE2gh6D9H0Xd9PtslG2JoVgoSYd3ntkJE91vopfaZLBlOVyPIZLDQUHyOgC8VJ8WUg/oXk26y2rwh+6HGk5ZEbqj5b5yB9wMJIc886fKoeNPDMzkt9c1v4gudxsHNjunIoANVz3Pc/2U8FPs942Oo5Hni8ssLuHqE47w+Swu7u48EmWpB0d9Fpoj5snJcbSgI4IA6DxnhBj2ntoEKHV/yVz+Ach7GlI1/7oW4+qo7jOj6nvKtHjHg9MH3j+FB08LB5RZnflHRVpEGQ==",
            "body": "<INSERT CIK>",
            "attributes": {
                "ApproximateReceiveCount": "9",
                "AWSTraceHeader": "Root=1-6544b6a7-7471377772400a4a75d1d94f;Parent=5bff94e0518db43b;Sampled=0",
                "SentTimestamp": "1699002139971",
                "SenderId": "AROA4R74ZO52XAB5OD7T4:S3-PROD-END",
                "ApproximateFirstReceiveTimestamp": "1699002139971"
            },
            "messageAttributes": {},
            "md5OfBody": "0b62e3ae39bff0363ff3607eba1206e1",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-1:385849856427:discount-check-queue",
            "awsRegion": "us-east-1"
        }
    ]
}

setEnvParameters().then(() => handler(event));

async function setEnvParameters(): Promise<void> {
    const ssmClient = new SSM({
        region: 'us-east-1'
    });
    await Promise.all([
        fetchEnvParameters(ssmClient),
        fetchFFSAuth(ssmClient)])
    .then(fetchedValues => {
        const [parameters] = fetchedValues;
        Object.keys(parameters).forEach(key => {
            process.env[key] = parameters[key];
        });
    });
}

async function fetchFFSAuth(ssmClient: SSM): Promise<void> {
    return ssmClient.getParametersByPath({
        Path: `/config/financial_facts_service`,
        Recursive: false,
        WithDecryption: true
    }).then((data: GetParametersByPathResult) => {
        if (data && data.Parameters) {
            const username = data.Parameters.find(param =>
                removePathFromName(param.Name) === 'financial-facts-service.username')?.Value;
            const password = data.Parameters.find(param =>
                removePathFromName(param.Name) === 'financial-facts-service.password')?.Value;
            const encoded = Buffer.from(`${username}:${password}`).toString('base64');
            process.env.ffs_auth = `Basic ${encoded}`;
        } else {
            console.log('FFS credentials were not found while initializing env');
            throw new EnvInitializationException('FFS credentials not found');
        }
    }).catch((error: any) => {
        console.log('FFS credentials were not found while initializing env');
        throw error;
    });
}

async function fetchEnvParameters(ssmClient: SSM): Promise<Record<string, string>> {
    return ssmClient.getParametersByPath({
        Path: `/config/facts_calculator_service/`,
        Recursive: false,
        WithDecryption: false
    }).then((data: GetParametersByPathResult) => {
        if (data.Parameters) {
            const valuePairs: Record<string, string> = {};
            data.Parameters.forEach(parameter => {
                if (parameter.Name && parameter.Value) {
                    valuePairs[removePathFromName(parameter.Name)] = parameter.Value;
                }
            });
            return valuePairs;
        } else {
            console.log('Parameters were not found while initializing env');
            throw new EnvInitializationException('Parameters were not found');
        }
    }).catch((error: any) => {
        console.log('Failed to initialize environment: ' + error);
        throw error;
    });
}

function removePathFromName(name: string | undefined): string {
    if (!name) {
        return CONSTANTS.GLOBAL.EMPTY;
    }
    return name.slice(name.lastIndexOf('/') + 1);
}
