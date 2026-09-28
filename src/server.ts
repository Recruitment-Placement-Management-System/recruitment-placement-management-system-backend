import 'dotenv/config'

import { env } from './config/env.js'
import app from "./app.js"
import { connectDatabase } from './infrastructure/database/connection.js'
import { logger } from './infrastructure/logger/logger.js'


const startServer = async():Promise<void>=>{
    try{
        await connectDatabase();

        app.listen(env.PORT,()=>{
            logger.info(`server running on port ${env.PORT}`)
        })
    }catch(error){
        logger.error(error);
        process.exit(1)
    }
}

startServer()