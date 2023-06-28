import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import DiscountController from '@/resources/controllers/DiscountController';
import FactsController from './resources/controllers/FactsController';


validateEnv();

const app = new App([
    new DiscountController(),
    new FactsController()
], Number(process.env.PORT));

app.listen();