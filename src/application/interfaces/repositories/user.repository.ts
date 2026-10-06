import type { User } from "../../../domain/entities/user.entity.js";
import type { UserQueryOptions,PaginatedUserResult } from "../../dto/admin/paginated-users.dto.js";

export interface IUserRepository{
    findById(id:string):Promise<User|null>;

    findByEmail(email:string):Promise<User|null>;

    findByPasswordResetTokenHash(tokenHash:string):Promise<User|null>
    
    create(user:User):Promise<User>;

    update(user:User):Promise<User>

    findPaginated(options:UserQueryOptions,):Promise<PaginatedUserResult<User>>
}