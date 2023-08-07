import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import DiscountController from '@/resources/controllers/DiscountController';
import FactsController from './resources/controllers/FactsController';
import initializeEnv from '@/utils/initializeEnv';
import DataSource from './datasource';
import ListenerController from './resources/controllers/ListenerController';
import PriceCheckConsumer from './resources/consumers/PriceCheckConsumer/PriceCheckConsumer';


initializeEnv().then(() => {
    const dataSource =  new DataSource();
    const app = new App(
        [
            new DiscountController(dataSource),
            new FactsController(dataSource),
            new ListenerController(dataSource)
        ], [
            new PriceCheckConsumer(dataSource)
        ], Number(+(process.env.service_port ?? 3000)));
    
    app.listen();
})