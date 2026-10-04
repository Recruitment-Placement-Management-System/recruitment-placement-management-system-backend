import { createHash } from "node:crypto";

export const hashResetToken = (token:string):string=>{
    return createHash("sha256").update(token).digest("hex")
}