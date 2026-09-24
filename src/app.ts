import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {pinoHttp} from 'pino-http'

import { logger } from './infrastructure/logger/logger.js'
import { errorMiddleware } from './presentation/middleware/error.middleware.js'
import { notFoundMiddleware } from './presentation/middleware/not-found.middleware.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(pinoHttp({logger}))

app.get('/health',(req,res)=>{
    res.status(200).json({
        success:true,
        message:'R&PMS API is running',
    })
})

app.use(notFoundMiddleware);
app.use(errorMiddleware)

export default app;