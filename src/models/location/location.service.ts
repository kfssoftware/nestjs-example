import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Location } from './location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateLocationDto, LocationDto, LocationFilterDto, UpdateLocationDto } from "./location.dtos";
import { ResException } from 'src/common/resException';
import { LocationMapper } from './location.mapper';
import { Status } from 'src/common/enums';

@Injectable()
export class LocationService extends BaseService<
    Location,
    CreateLocationDto,
    UpdateLocationDto,
    LocationDto
> {
    constructor(@InjectRepository(Location) public repository: Repository<Location>) {
        super();
    }

    async updateStatus(id: number, status: number): Promise<{ data: Location, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as Location,
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

    async _treeList(alias: string) {
        const manager = getManager();
        const trees = await manager.getTreeRepository(alias).findTrees();
        return {
            data: trees,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total: trees.length,
            page: 1,
            last_page: null
        };
    }

    async _list(alias: string, languageFilterDto: LocationFilterDto) {
        const builder = await this.repository.createQueryBuilder("location");
        if (languageFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${languageFilterDto.id}`, status: Status.Deleted })
        if (languageFilterDto.search)
            builder.where("LOWER(name) LIKE :s", { s: `%${languageFilterDto.search.toLowerCase()}%` })

        if (languageFilterDto.name)
            builder.where("LOWER(name) LIKE :s", { s: `%${languageFilterDto.name.toLowerCase()}%` })

        if (languageFilterDto.status)
            builder.where("status = :s", { s: `${languageFilterDto.status}` })

        builder.select("*");

        builder.addSelect(subQuery => {
            return subQuery
                .select('parent.fullName')
                .from(alias, 'parent')
                .where('parent.id = location.parentLocationId');
        }, 'parentLocationName')

        const sort: any = languageFilterDto.sortby;
        if (sort)
            builder.orderBy(sort.key, sort.order.toUpperCase());
        else
            builder.orderBy('id', "DESC");

        const page: number = parseInt(languageFilterDto.page as any) || 1;
        const perPage: number = parseInt(languageFilterDto.limit as any) || 10;
        const total = await builder.getCount();

        builder.offset((page - 1) * perPage).limit(perPage);
        const data = await builder.getRawMany();
        const responseData = [];
        data.forEach(item => {
            responseData.push(LocationMapper.ModelToDto(item));
        });
        return {
            data: responseData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total,
            page,
            last_page: Math.ceil(total / perPage)
        };
    }

    async _dropdown(alias: string, languageFilterDto: LocationFilterDto) {
        const builder = await this.repository.createQueryBuilder("location");
        if (languageFilterDto.parentLocationId)
            builder.where(alias + ".parentLocationId = :pid AND " + alias + ".status = :status", { status: Status.Active, pid: languageFilterDto.parentLocationId })
        else
            builder.where(alias + ".parentLocationId IS NULL AND " + alias + ".status = :status", { status: Status.Active })

        if (languageFilterDto.search)
            builder.andWhere("LOWER(" + alias + ".name) LIKE :search", { search: `%${languageFilterDto.search.toLowerCase()}%` })

        const sort: any = languageFilterDto.sortby;
        if (sort)
            builder.orderBy(sort.key, sort.order.toUpperCase());
        else
            builder.orderBy('name', "ASC");

        const page: number = parseInt(languageFilterDto.page as any) || 1;
        const perPage: number = parseInt(languageFilterDto.limit as any) || 10;
        const total = await builder.getCount();

        builder.offset((page - 1) * perPage).limit(perPage);
        const data = await builder.getMany();
        const responseData = [];
        data.forEach(item => {
            responseData.push(LocationMapper.ModelToDto(item));
        });
        return {
            data: responseData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total,
            page,
            last_page: Math.ceil(total / perPage)
        };
    }
}
