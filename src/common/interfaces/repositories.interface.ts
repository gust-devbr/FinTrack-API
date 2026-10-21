export interface IRepository<TEntity, TCreate, TUpdate> {
  findById(id: string): Promise<TEntity | null>;
  create(data: TCreate): Promise<TEntity>;
  update(data: TUpdate): Promise<TEntity>;
  remove(id: string): Promise<void>;
}
