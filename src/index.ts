import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import initializeEnv from '@/utils/initializeEnv';
import ListenerController from './resources/controllers/listener.controller';
import PriceCheckConsumer from '@/resources/consumers/price-check-consumer/price-check.consumer';
import bootstrap from './bootstrap';


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
