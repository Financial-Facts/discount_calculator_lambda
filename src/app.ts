import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import ErrorMiddleware from '@/middleware/ErrorHandler.middleware';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import Controller from './resources/controllers/controller.typings';
import Consumer from './resources/consumers/consumer.typings';

class App {

    public express: Application;
    public port: number;

    constructor(controllers: Controller[], consumers: Consumer[], port: number) {
        this.express = express();
        this.port = port;
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeConsumer(consumers);
        this.initializeErrorHandling();
        this.initializeSwagger();
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach(controller => {
            this.express.use('\/', controller.router);
        });
    }

    private initializeConsumer(consumers: Consumer[]): void {
        consumers.forEach(consumer => {
            consumer.startPolling();
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initializeSwagger(): void {
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`Listening on port ${this.port}...`);
        });
    }
}

export default App;
