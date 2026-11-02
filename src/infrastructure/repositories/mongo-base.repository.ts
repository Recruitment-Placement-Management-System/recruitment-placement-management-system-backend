import type { Document, Model } from "mongoose";

/** Shared Mongo persistence for repositories with customizable update operators. */
export abstract class MongoBaseRepository<
  TEntity extends { id: string | undefined },
  TDocument extends Document,
  TCreateData,
  TUpdateOperations = { $set: TCreateData },
> {
  protected constructor(
    private readonly model: Model<TDocument>,
    private readonly toDomain: (document: TDocument) => TEntity,
    private readonly toCreateData: (entity: TEntity) => TCreateData,
    private readonly toUpdateOperations: (entity: TEntity) => TUpdateOperations,
    private readonly notFoundMessage: string,
  ) {}

  async create(entity: TEntity): Promise<TEntity> {
    const document = await this.model.create(this.toCreateData(entity) as never);
    return this.toDomain(document as TDocument);
  }

  async update(entity: TEntity): Promise<TEntity> {
    if (!entity.id) throw new Error("Cannot update an entity without an id");

    const document = await this.model.findByIdAndUpdate(
      entity.id,
      this.toUpdateOperations(entity) as never,
      { new: true, runValidators: true },
    ).exec();

    if (!document) throw new Error(this.notFoundMessage);
    return this.toDomain(document as TDocument);
  }
}
