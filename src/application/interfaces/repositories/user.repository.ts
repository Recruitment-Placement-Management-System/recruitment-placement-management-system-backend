import type { User } from "../../../domain/entities/user.entity.js";
import type { IRepository } from "./repository.js";

export interface IUserRepository extends IRepository<User>{
    findById(id:string):Promise<User|null>;

    findByEmail(email:string):Promise<User|null>;

    findByPasswordResetTokenHash(tokenHash:string):Promise<User|null>
    
}
