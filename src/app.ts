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
import { createRecruiterVerificationRouter } from './presentation/recruiter-verification/routes/recruiter-verification.routes.js'
import { recruiterVerificationDependencies } from './DI/recruiter-verification.container.js'
import { createRecruiterJobsRouter } from './presentation/jobs/routes/recruiter-jobs.routes.js'
import { createPublishedJobsRouter } from './presentation/jobs/routes/published-jobs.routes.js'
import { jobDependencies } from './DI/jobs.container.js'
import { createCandidateJobsRouter } from './presentation/jobs/routes/candidate-jobs.routes.js'
import { createCandidateSavedJobsRouter } from './presentation/jobs/routes/candidate-saved-jobs.routes.js'
import { candidateJobDependencies } from './DI/candidate-jobs.container.js'
import { candidateApplicationDependencies, recruiterApplicationDependencies } from './DI/applications.container.js'
import { createCandidateApplicationsRouter } from './presentation/applications/routes/candidate-applications.routes.js'
import { createRecruiterApplicationsRouter } from './presentation/applications/routes/recruiter-applications.routes.js'

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
app.use('/api/recruiter/verification', createRecruiterVerificationRouter(recruiterVerificationDependencies))
app.use('/api/recruiter/jobs', createRecruiterJobsRouter(jobDependencies))

app.use('/api/jobs', createPublishedJobsRouter(jobDependencies))
app.use('/api/candidate/jobs', createCandidateJobsRouter(candidateJobDependencies))
app.use('/api/candidate/saved-jobs', createCandidateSavedJobsRouter(candidateJobDependencies))

app.use('/api/candidate/applications', createCandidateApplicationsRouter(candidateApplicationDependencies))
app.use('/api/recruiter/applications', createRecruiterApplicationsRouter(recruiterApplicationDependencies))


app.use(notFoundMiddleware);
app.use(createErrorMiddleware(logger))

export default app;
