import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js"
import customersRouter from "./routes/customersRouter.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);

app.listen(process.env.PORT, ()=>{
    console.log(chalk.bold.green(`Servidor rodando na porta ${process.env.PORT}`))
})