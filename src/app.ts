import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {pinoHttp} from 'pino-http'
import cookieParser from 'cookie-parser'

import { logger } from './infrastructure/logger/logger.js'
import { createErrorMiddleware } from './presentation/middleware/error.middleware.js'
import { notFoundMiddleware } from './presentation/middleware/not-found.middleware.js'

import { createAuthRouter } from './presentation/auth/routes/auth.routes.js'
import { createAdminRouter } from './presentation/admin/routes/admin.routes.js'
import { authDependencies, adminDependencies } from './DI/container.js'

const app = express()

app.use(helmet())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
  }))
app.use(express.json())
app.use(cookieParser())
app.use(pinoHttp({logger}))

app.use('/api/auth', createAuthRouter(authDependencies))
app.use('/api/admin', createAdminRouter(adminDependencies))


app.use(notFoundMiddleware);
app.use(createErrorMiddleware(logger))

export default app;
