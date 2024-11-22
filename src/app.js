import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

mongoose.set("strictQuery", false);

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import config from "./config/config.js";

//Importamos el nuevo router de mocks: 
import mocksRouter from "./routes/mocks.router.js"; 

const app = express();
const PORT = config.app.PORT;
const CONNECTION_STRING = config.mongo.URL;

mongoose.connect(CONNECTION_STRING);

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/api/mocks", mocksRouter); 

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))


import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express"; 

const swaggerOptions = {
    definition: {
        openapi: "3.0.1", 
        info: {
            title: "Documentación de la App Adoptame",
            description: "App dedicada a encontrar familias para los perritos de la calle"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs)); 