import CONSTANTS from "@/resources/resource.contants";
import EnvInitializationException from "@/utils/exceptions/EnvInitializationException";
import { SSM, GetParametersByPathResult } from "@aws-sdk/client-ssm";
import { SQSEvent } from "aws-lambda";
import { handler } from "index";
import words from 'random-words'

const event: SQSEvent = {
    "Records": [
        {
            "messageId": words(1)[0],
            "receiptHandle": words(1)[0],
            "body": "<INSERT CIK>",
            "attributes": {
                "ApproximateReceiveCount": words(1)[0],
                "AWSTraceHeader": words(1)[0],
                "SentTimestamp": words(1)[0],
                "SenderId": words(1)[0],
                "ApproximateFirstReceiveTimestamp": words(1)[0]
            },
            "messageAttributes": {},
            "md5OfBody": words(1)[0],
            "eventSource": words(1)[0],
            "eventSourceARN": words(1)[0],
            "awsRegion": words(1)[0]
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
