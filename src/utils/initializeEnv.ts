import { cleanEnv, port } from "envalid";
import  { GetParametersByPathResult, SSM } from '@aws-sdk/client-ssm';
import CONSTANTS from "../Services/ServiceConstants";
import EnvInitializationException from "./exceptions/EnvInitializationException";
import { AWSError } from "sqs-consumer";

async function initializeEnv(): Promise<void> {
    const filename = 'parameters.json';
    return setEnvParameters().then(() => {
        cleanEnv(process.env, {
            service_port: port({ default: 3000 })
        });
    });
}

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
    }).catch((error: AWSError) => {
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
    }).catch((error: AWSError) => {
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

export default initializeEnv;
