import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

//Importamos el nuevo router de mocks: 
import mocksRouter from "./routes/mocks.router.js"; 

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect("mongodb+srv://eduardogalli89:coderhouse@cluster0.sk8uaq4.mongodb.net/backend3")

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