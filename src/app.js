import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();



app.listen(process.env.PORT, ()=>{
    console.log(chalk.bold.green(`Servidor rodando na porta ${process.env.PORT}`))
})