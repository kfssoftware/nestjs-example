import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, RoleDto, RoleFilterDto, UpdateRoleDto } from "./role.dtos";
import { ResException } from 'src/common/resException';
import { RoleActionEnum, RoleActionEnumLabel, Status } from 'src/common/enums';
import { RoleMapper } from './role.mapper';

@Injectable()
export class RoleService extends BaseService<
Role,
CreateRoleDto,
UpdateRoleDto,
RoleDto
> {
  constructor(
    @InjectRepository(Role) public repository: Repository<Role>,
  ) {
    super();
  }

  async updateStatus(id: number, status: number): Promise<{ data: Role, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      await this.repository.update(id, { status: status });
      const resData = await this.repository.findOne(id);
      return {
        data: resData as Role,
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

  totree(branches, node) {
    if (!branches[node.topAction]) {
      branches[node.topAction] = {};
    }
    branches[node.topAction][node.value] = node;
    branches[node.value] = Object.assign(node, branches[node.value]);
    return branches;
  }

  async _detail(recipeId: number) {
    const data = await this.repository.findOne(recipeId);
    return {
      data: RoleMapper.ModelToDto(data),
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async getEmptyActions() {
    try {
      var enumValue: any = RoleActionEnum;
      var enumLabelValue: any = RoleActionEnumLabel;
      const propertyNames = Object.keys(enumValue);
      const enums = propertyNames.filter(y => parseInt(y)).map(propertyName => enumLabelValue.get(Number(propertyName)));
      const data = [];
      const keys = enumLabelValue.keys();
      for (const enum_ of enums) {
        let value = keys.next().value;
        if (!enum_.topAction) {
          data.push({
            value: value,
            topAction: null,
            title: enum_.label,
            children: enums.filter(_ => _.topAction == value).map((_enum, i) => {
              return {
                value: _enum.topAction + (i + 1),
                topAction: _enum.topAction,
                title: _enum.label
              }
            })
          })
        }
      }
      return {
        data: data,
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
  };

  async _dropdown(roleFilterDto: RoleFilterDto) {
    const builder = await this.repository.createQueryBuilder('role');
    if (roleFilterDto.search)
      builder.where("LOWER(role.name) LIKE :s", { s: `%${roleFilterDto.search.toLowerCase()}%` })

    builder.orderBy('role.id', "DESC");
    const total = await builder.getCount();
    return {
      data: await builder.getMany(),
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      total,
      page: 1,
      pageCount: Math.ceil(total / 99999999999)
    };
  }

  async _list(alias: string, roleFilterDto: RoleFilterDto) {
    const builder = await this.repository.createQueryBuilder(alias);
    if (roleFilterDto.id)
      builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${roleFilterDto.id}`, status: Status.Deleted })
    else {
      if (roleFilterDto.status)
        builder.where(alias + ".status = :s", { s: `${roleFilterDto.status}` })
      else
        builder.where(alias + ".status != :s", { s: `${Status.Deleted}` })
      if (roleFilterDto.search)
        builder.where("LOWER(" + alias + ".name) LIKE :s", { s: `%${roleFilterDto.search.toLowerCase()}%` })

      if (roleFilterDto.userType)
        builder.where(alias + ".userType = :u", { u: `${roleFilterDto.userType}` })

      if (roleFilterDto.name)
        builder.where("LOWER(" + alias + ".name) LIKE :n", { n: `%${roleFilterDto.name.toLowerCase()}%` })
    }

    const sort: any = roleFilterDto.sortby;

    if (sort)
      builder.orderBy(alias + '.Id', sort.order.toUpperCase());
    else
      builder.orderBy(alias + '.id', "DESC");

    const page: number = parseInt(roleFilterDto.page as any) || 1;
    const perPage: number = parseInt(roleFilterDto.limit as any) || 10;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    const data = await builder.getMany();
    const responseData = [];
    data.forEach(item => {
      responseData.push(RoleMapper.ModelToDto(item));
    });

    return {
      data: responseData,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      total,
      page,
      pageCount: Math.ceil(total / perPage)
    };
  }
}
