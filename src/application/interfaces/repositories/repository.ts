export interface IRepository<TEntity> {
  create(entity: TEntity): Promise<TEntity>;
  update(entity: TEntity): Promise<TEntity>;
}
