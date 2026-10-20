import { User } from "../../domain/entities/user.entity.js";
import type { IUserRepository } from "../../application/interfaces/repositories/user.repository.js";
import type { IAdminUserQueryRepository } from "../../application/interfaces/repositories/admin-user-query.repository.js";
import {
  UserModel,
} from "../database/models/user.model.js";
import type { UserQueryOptions,PaginatedUserResult } from "../../application/dto/admin/paginated-users.dto.js";
import { getPagination } from "../../shared/utils/pagination.js";
import { UserMapper } from "../mappers/user.mapper.js";

export class MongoUserRepository implements IUserRepository, IAdminUserQueryRepository {
  async findById(id: string): Promise<User | null> {
    const document = await UserModel.findById(id).exec();

    if (!document) {
      return null;
    }

    return UserMapper.toDomain(document);
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await UserModel
      .findOne({
        email: email.trim().toLowerCase(),
      })
      .exec();

    if (!document) {
      return null;
    }

    return UserMapper.toDomain(document);
  }

  async create(user: User): Promise<User> {
    const document = await UserModel.create(UserMapper.toCreateData(user));
    return UserMapper.toDomain(document);
}

  async update(user: User): Promise<User> {
    if (!user.id) {
      throw new Error("Cannot update a user without an id");
    }

    const document = await UserModel.findByIdAndUpdate(
      user.id,
      UserMapper.toUpdateOperations(user),
      {
        new:true,
        runValidators:true
      },
    ).exec()

    if (!document) {
      throw new Error("User not found");
    }

    return UserMapper.toDomain(document);
  }


  async findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({
      passwordResetTokenHash:tokenHash
    })

    if(!userDocument)return null;

    return UserMapper.toDomain(userDocument)
  }





  async findPaginated(options: UserQueryOptions): Promise<PaginatedUserResult<User>> {
    const {page,limit} = options;
    const {skip} = getPagination(page,limit);

    const [documents,total] = await Promise.all([
      UserModel.find().skip(skip).limit(limit).exec(),
      UserModel.countDocuments().exec(),
    ]);

    return {
      users:documents.map(UserMapper.toDomain),
      total,
      page,
      limit,
      pages:Math.ceil(total/limit)
    }
  }
}
