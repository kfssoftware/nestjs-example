import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { Status } from "src/common/enums";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import { CreateRecipeCommentDto, UpdateRecipeCommentDto, RecipeCommentDto, RecipeCommentFilterDto } from "./recipe-comment.dtos";
import { RecipeComment } from "./recipe-comment.entity";
import { RecipeCommentMapper } from "./recipe-comment.mapper";

@Injectable()
export class RecipeCommentService extends BaseService<
    RecipeComment,
    CreateRecipeCommentDto,
    UpdateRecipeCommentDto,
    RecipeCommentDto
> {
    constructor(@InjectRepository(RecipeComment) public repository: Repository<RecipeComment>) {
        super();
    }

    async recipeList(recipeCommentFilterDto: RecipeCommentFilterDto) {
        const alias = "recipe_comment";
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeCommentFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeCommentFilterDto.id}`, status: Status.Deleted })
        else
            builder.where(alias + ".recipeId = :s AND " + alias + ".status = :status", { s: `${recipeCommentFilterDto.recipeId}`, status: Status.Active })

        builder.relation("recipe");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".recipe", "recipe")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeCommentFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeCommentFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeCommentFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeCommentMapper.ModelToDto(item));
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

    async updateStatus(id: number, status: number): Promise<{ data: RecipeComment, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as RecipeComment,
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