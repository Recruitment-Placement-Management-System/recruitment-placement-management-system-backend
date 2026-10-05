import type { RequestHandler } from "express"
import type { ZodType } from "zod"
import { AppError } from "../../shared/errors/app-error.js"

export const validate = (schema:ZodType,):RequestHandler=>{
    return(req,_res,next)=>{
        const result = schema.safeParse(req.body);

        if(!result.success){
            throw new AppError(
                400,
                'Validation failed',
                'VALIDATION_ERROR',
            );
        }
        req.body = result.data;
        next()
    }
}