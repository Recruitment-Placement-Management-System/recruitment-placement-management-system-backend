import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";

export class ListUsersUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
    ){}

    async execute(){
        return this.userRepository.findAll()
    }
}