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
import { createCandidateProfileRouter } from './presentation/candidate-profile/routes/candidate-profile.routes.js'
import { authDependencies, adminDependencies } from './DI/container.js'
import { candidateProfileDependencies } from './DI/candidate-profile.container.js'
import { createRecruiterProfileRouter } from './presentation/recruiter-profile/routes/recruiter-profile.routes.js'
import { recruiterProfileDependencies } from './DI/recruiter-profile.container.js'
import { createRecruiterCompanyRouter } from './presentation/recruiter-company/routes/recruiter-company.routes.js'
import { recruiterCompanyDependencies } from './DI/recruiter-company.container.js'

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
app.use('/api/candidate/profile', createCandidateProfileRouter(candidateProfileDependencies))
app.use('/api/recruiter/profile',createRecruiterProfileRouter(recruiterProfileDependencies))
app.use('/api/recruiter/company', createRecruiterCompanyRouter(recruiterCompanyDependencies))


app.use(notFoundMiddleware);
app.use(createErrorMiddleware(logger))

export default app;
