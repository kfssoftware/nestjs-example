import { FindManyOptions, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { omit, pick, castArray } from 'lodash';
import { HttpStatus } from '@nestjs/common';
import { ResException } from './resException';

export abstract class BaseService<Model, CreateDTO, UpdateDTO, ListDto> {
  public abstract repository: Repository<Model>;

  async create(createDto: CreateDTO): Promise<{ data: Model, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const res = await this.repository.insert(createDto);
      const resData = await this.repository.findOne(res.identifiers[0].id);
      return {
        data: resData as Model,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: res[1]
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
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
    let data = [];
    res[0].map(item => {
      let itemDetail = item as any;
      if (itemDetail.value == null)
        itemDetail.value = itemDetail.id;
      data.push(item);
    })
    return {
      data: data,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: res[1]
    };
  }

  async detail(id?: number, options?: FindOneOptions): Promise<{ data: Model; status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    const res = await this.repository.findOne(id, options);
    return {
      data: res as Model,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: null,
    };
  }

  async update(id: number, updateDto: UpdateDTO): Promise<{ data: Model, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      await this.repository.update(id, updateDto);
      const resData = await this.repository.findOne(id);
      return {
        data: resData as Model,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  async delete(id: number): Promise<{ data: boolean, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      await this.repository.delete(id);
      return {
        data: true,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
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
