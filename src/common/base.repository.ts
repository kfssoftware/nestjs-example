import { FindManyOptions, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { omit, pick, castArray } from 'lodash';

export abstract class BaseRepository<Model, CreateDTO, UpdateDTO> {
  public abstract repository: Repository<Model>;

  async create(createDto: CreateDTO): Promise<Model> {
    const res = await this.repository.insert(createDto);
    return res.identifiers[0] as Model;
  }

  async setDataUpdate(model: Model, update: UpdateDTO): Promise<Model> {
    Object.entries(update).forEach(([key, value]) => {
      model[key] = value;
    });
    return model;
  }

  async list(
    options?: FindManyOptions<Model>,
  ): Promise<{ data: Model[]; status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    const res = await this.repository.findAndCount(options);
    return {
      data: res[0],
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: res[1]
    };
  }

  async dropdown(
    options?: FindManyOptions<Model>,
  ): Promise<{ data: Model[]; status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    const res = await this.repository.findAndCount(options);
    return {
      data: res[0],
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: res[1]
    };
  }

  async detail(id?: number, options?: FindOneOptions): Promise<Model> {
    return this.repository.findOne(id, options);
  }

  async update(id: number, updateDto: UpdateDTO): Promise<void> {
    await this.repository.update(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async setFilters(
    query: SelectQueryBuilder<Model>,
    filters?: Record<string, any>
  ): Promise<SelectQueryBuilder<Model>> {
    return this._processBaseFilters(query, filters, Object.keys(filters || {}));
  }

  private _processBaseFilters<Filters>(
    query: SelectQueryBuilder<Model>,
    filters: Filters,
    filterKeys: any
  ): SelectQueryBuilder<Model> {
    if (filters) {
      Object.entries(filters)
        .filter((i) => Array.from(filterKeys).includes(i[0]))
        .forEach((i) => this._processBaseFilter(query, i));
    }

    return query;
  }

  private _processBaseFilter(
    query: SelectQueryBuilder<Model>,
    [filterKey, filterValues]: [string, unknown]
  ): SelectQueryBuilder<Model> {
    if (Array.isArray(filterValues) && filterValues.length) {
      query.andWhere(`base.${filterKey} IN (:...${filterKey}Values)`, {
        [`${filterKey}Values`]: castArray(filterValues),
      });
    }
    return query;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Model>> {
    return await paginate<Model>(this.repository, options);
  }
}
