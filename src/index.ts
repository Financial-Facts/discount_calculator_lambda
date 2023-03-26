import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import DiscountController from '@/resources/discount/DiscountController';


validateEnv();

const app = new App([
    new DiscountController()
], Number(process.env.PORT));

app.listen();