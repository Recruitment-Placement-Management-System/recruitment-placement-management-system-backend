import mongoose from "mongoose"

import { env } from "../../config/env.js"
import { logger } from "../logger/logger.js";

export const connectDatabase = async ():Promise<void>=>{
    await mongoose.connect(env.MONGODB_URI);

    logger.info('MongoDB connected successfully')
}