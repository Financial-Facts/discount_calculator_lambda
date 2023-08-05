import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import DiscountController from '@/resources/controllers/DiscountController';
import FactsController from './resources/controllers/FactsController';
import initializeEnv from '@/utils/initializeEnv';
import DiscountCheckListener from './resources/listeners/DiscountCheckListener/DiscountCheckListener';


initializeEnv().then(() => {
    const app = new App(
        [
            new DiscountController(),
            new FactsController()
        ], [
            new DiscountCheckListener()
        ], Number(+(process.env.service_port ?? 3000)));
    
    app.listen();
})