import argon2 from 'argon2'

import type { IPasswordService } from '../../application/interfaces/services/password.service.js'

export class Argon2PasswordService implements IPasswordService{
    async hash(password:string):Promise<string>{
        return argon2.hash(password)
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return argon2.verify(passwordHash,password)
    }
}