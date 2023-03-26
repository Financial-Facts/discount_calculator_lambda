import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        PORT: port({ default: 3000 }),
        FINANCIAL_FACTS_SERVICE_BASE_URL: str()
    })
}

export default validateEnv;
