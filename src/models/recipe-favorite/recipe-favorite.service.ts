import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { Status } from "src/common/enums";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { CreateRecipeFavoriteDto, UpdateRecipeFavoriteDto, RecipeFavoriteDto, RecipeFavoriteFilterDto } from "./recipe-favorite.dtos";
import { RecipeFavorite } from "./recipe-Favorite.entity";
import { RecipeFavoriteMapper } from "./recipe-favorite.mapper";

@Injectable()
export class RecipeFavoriteService extends BaseService<
    RecipeFavorite,
    CreateRecipeFavoriteDto,
    UpdateRecipeFavoriteDto,
    RecipeFavoriteDto
> {
    constructor(@InjectRepository(RecipeFavorite) public repository: Repository<RecipeFavorite>) {
        super();
    }

    async _create(user: User, createDto: CreateRecipeFavoriteDto): Promise<{ data: RecipeFavorite, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            createDto.userId = user.id;
            const getControlData = await this.repository.findOne({ where: { status: Status.Active, recipeId: createDto.recipeId, userId: user.id } });
            let res = null;
            if (getControlData) {
                res = await this.repository.delete(getControlData.id);
            }
            else {
                res = await this.repository.insert(createDto);
            }
            const resData = getControlData ? [] : await this.repository.findOne(res.identifiers[0].id);
            return {
                data: resData as RecipeFavorite,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null
            };
        } catch (error) {
            console.log(error);
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
            );
        }
    }

    async recipeGeneralList(recipeFavoriteFilterDto: RecipeFavoriteFilterDto) {
        const alias = "recipe_favorite";
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFavoriteFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeFavoriteFilterDto.id}`, status: Status.Deleted })
        else
            builder.where(alias + ".recipeId = :s AND " + alias + ".status = :status", { s: `${recipeFavoriteFilterDto.recipeId}`, status: Status.Active })

        builder.relation("recipe");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".recipe", "recipe")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFavoriteFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFavoriteFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFavoriteFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeFavoriteMapper.ModelToDto(item));
            }));
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

    async recipeList(user: User, recipeFavoriteFilterDto: RecipeFavoriteFilterDto) {
        const alias = "recipe_favorite";
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFavoriteFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeFavoriteFilterDto.id}`, status: Status.Deleted })
        else
            builder.where(alias + ".userId = :s AND " + alias + ".status = :status", { s: user.id, status: `${Status.Active}` })

        builder.relation("recipe");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".recipe", "recipe")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFavoriteFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFavoriteFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFavoriteFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeFavoriteMapper.ModelToDto(item));
            }));
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

    async updateStatus(id: number, status: number): Promise<{ data: RecipeFavorite, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as RecipeFavorite,
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
}