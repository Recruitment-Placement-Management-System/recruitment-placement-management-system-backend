import type { IAdminUserQueryRepository } from "../../interfaces/repositories/admin-user-query.repository.js";
import type { UserQueryOptions } from "../../dto/admin/paginated-users.dto.js";

export class ListUsersUseCase{
    constructor(
        private readonly userRepository:IAdminUserQueryRepository,
    ){}

    async execute(options:UserQueryOptions){
        return this.userRepository.findPaginated(options)
    }
}
