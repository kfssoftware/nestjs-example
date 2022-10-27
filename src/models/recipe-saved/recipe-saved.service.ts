import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { Status } from "src/common/enums";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { CreateRecipeSavedDto, UpdateRecipeSavedDto, RecipeSavedDto, RecipeSavedFilterDto } from "./recipe-saved.dtos";
import { RecipeSaved } from "./recipe-saved.entity";
import { RecipeSavedMapper } from "./recipe-saved.mapper";

@Injectable()
export class RecipeSavedService extends BaseService<
    RecipeSaved,
    CreateRecipeSavedDto,
    UpdateRecipeSavedDto,
    RecipeSavedDto
> {
    constructor(@InjectRepository(RecipeSaved) public repository: Repository<RecipeSaved>) {
        super();
    }

    async _create(user: User, createDto: CreateRecipeSavedDto): Promise<{ data: RecipeSaved, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
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
                data: resData as RecipeSaved,
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

    async recipeList(user: User, recipeSavedFilterDto: RecipeSavedFilterDto) {
        const alias = "recipe_saved";
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeSavedFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeSavedFilterDto.id}`, status: Status.Deleted })
        else
            builder.where(alias + ".userId = :s AND " + alias + ".status = :status", { s: user.id, status: `${Status.Active}` })

        builder.relation("recipe");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".recipe", "recipe")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeSavedFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeSavedFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeSavedFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeSavedMapper.ModelToDto(item));
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


    async updateStatus(id: number, status: number): Promise<{ data: RecipeSaved, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as RecipeSaved,
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