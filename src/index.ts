import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import DiscountController from '@/resources/controllers/DiscountController';
import FactsController from './resources/controllers/FactsController';
import initializeEnv from '@/utils/initializeEnv';
import ListenerController from './resources/controllers/ListenerController';
import PriceCheckConsumer from './resources/consumers/PriceCheckConsumer/PriceCheckConsumer';
import IdentityController from './resources/controllers/IdentityController';
import discountService from './resources/services/discount-service/DiscountService';
import Service from './utils/interfaces/IService';
import factsService from './resources/services/facts-service/FactsService';
import identityService from './resources/services/identity-service/IdentityService';
import historicalPriceService from './Services/HistoricalPriceService/HistoricalPriceService';


initializeEnv().then(() => {
    initializeServices([
        discountService,
        factsService,
        identityService,
        historicalPriceService
    ]);
    const app = new App(
        [
            new DiscountController(),
            new FactsController(),
            new IdentityController(),
            new ListenerController()
        ], [
            new PriceCheckConsumer()
        ],
        Number(+(process.env.service_port ?? 3000)));
    
    app.listen();
})

function initializeServices(services: Service[]): void {
    services.forEach(service => {
        service.setUrl();
    });
}