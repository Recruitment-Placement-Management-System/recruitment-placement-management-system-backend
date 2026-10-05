import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {pinoHttp} from 'pino-http'
import cookieParser from 'cookie-parser'

import { logger } from './infrastructure/logger/logger.js'
import { errorMiddleware } from './presentation/middleware/error.middleware.js'
import { notFoundMiddleware } from './presentation/middleware/not-found.middleware.js'

import authRoutes from './presentation/auth/routes/auth.routes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(pinoHttp({logger}))

app.use('/api/auth',authRoutes)


app.use(notFoundMiddleware);
app.use(errorMiddleware)

export default app;