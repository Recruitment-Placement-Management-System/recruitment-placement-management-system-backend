import type { User } from "../../../domain/entities/user.entity.js";
import type { PaginatedUserResult, UserQueryOptions } from "../../dto/admin/paginated-users.dto.js";

export interface IAdminUserQueryRepository {
  findPaginated(options: UserQueryOptions): Promise<PaginatedUserResult<User>>;
}
