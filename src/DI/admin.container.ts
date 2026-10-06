import { ListUsersUseCase } from "../application/use-cases/admin/list-users.use-case.js";

import { MongoUserRepository } from "../infrastructure/repositories/mongo-user.repository.js";

const userRepository = new MongoUserRepository();

export const listUsersUseCase = new ListUsersUseCase(
    userRepository,
)