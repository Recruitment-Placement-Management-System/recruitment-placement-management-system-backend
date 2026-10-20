import type { LoginUseCase } from "../../application/use-cases/auth/login.use-case.js";
import type { ListUsersUseCase } from "../../application/use-cases/admin/list-users.use-case.js";
import type { ITokenService } from "../../application/interfaces/services/token.service.js";

export interface AdminControllerDependencies {
  loginUseCase: LoginUseCase;
  listUsersUseCase: ListUsersUseCase;
  tokenService: ITokenService;
}
