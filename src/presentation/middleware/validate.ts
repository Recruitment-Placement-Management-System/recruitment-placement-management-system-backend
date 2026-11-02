import type { RequestHandler } from "express"
import type { ZodType } from "zod"
import { AppError } from "../../application/errors/app-error.js"
import { HttpStatus } from "../../shared/constants/http-status.js"

export const validate = (schema:ZodType,):RequestHandler=>{
    return(req,_res,next)=>{
        const result = schema.safeParse(req.body);

        if(!result.success){
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                'Validation failed',
                'VALIDATION_ERROR',
            );
        }
        req.body = result.data;
        next()
    }
}
