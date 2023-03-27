import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import DiscountController from '@/resources/discount/DiscountController';
import FactsController from './resources/facts/FactsController';


validateEnv();

const app = new App([
    new DiscountController(),
    new FactsController()
], Number(process.env.PORT));

app.listen();