import express from "express"
import bootstrap from "./Src/app.controller.js"
import dotenv from "dotenv"
import chalk from "chalk"

dotenv.config({path:"./Src/Config/.env.dev"})
const app = express()
const port = process.env.PORT

await bootstrap (app,express)

app.listen(port , ()=>{
    console.log(chalk.bgGreen(chalk.black(` Server is running http://localhost:${port} `)));
}) 

