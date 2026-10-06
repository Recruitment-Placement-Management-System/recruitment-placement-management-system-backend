import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { UserQueryOptions } from "../../dto/admin/paginated-users.dto.js";

export class ListUsersUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
    ){}

    async execute(options:UserQueryOptions){
        return this.userRepository.findPaginated(options)
    }
}