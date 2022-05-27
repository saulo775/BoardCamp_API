import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import categoriesRouter from "./routes/categoriesRouter.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use(categoriesRouter);

app.listen(process.env.PORT, ()=>{
    console.log(chalk.bold.green(`Servidor rodando na porta ${process.env.PORT}`))
})