import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import initializeEnv from '@/utils/initializeEnv';
import ListenerController from './resources/controllers/ListenerController';
import PriceCheckConsumer from './resources/consumers/PriceCheckConsumer/PriceCheckConsumer';
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
