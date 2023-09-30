import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import initializeEnv from '@/utils/initializeEnv';
import bootstrap from './bootstrap';
import ListenerController from './resources/listener.controller';
import PriceCheckConsumer from './resources/price-check-consumer/price-check.consumer';


initializeEnv().then(() => {
    bootstrap();
    const app = new App(
        [
            new ListenerController()
        ], [
            new PriceCheckConsumer()
        ],
        Number(+(process.env.service_port ?? 3000)));
    
    app.listen();
})
