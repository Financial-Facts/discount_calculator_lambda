import 'module-alias/register';
import initializeEnv from '@/utils/initializeEnv';
import bootstrap from './src/bootstrap';
import PriceCheckConsumer from '@/resources/price-check-consumer/price-check.consumer';

export const handler = async (): Promise<void> => {
    console.log('Initializing environment');
    return initializeEnv().then(async () => {
        bootstrap();

        console.log('Initializing polling');
        const polling = [
            new PriceCheckConsumer()
        ].map(consumer => consumer.startPolling());
        return Promise.all(polling).then(() => {
            console.log('Polling complete for all consumers');
        });
    });
};
