import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { Status } from "src/common/enums";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import { CreateRecipeStepDto, UpdateRecipeStepDto, RecipeStepDto, RecipeStepFilterDto } from "./recipe-step.dtos";
import { RecipeStep } from "./recipe-step.entity";
import { RecipeStepMapper } from "./recipe-step.mapper";

@Injectable()
export class RecipeStepService extends BaseService<
    RecipeStep,
    CreateRecipeStepDto,
    UpdateRecipeStepDto,
    RecipeStepDto
> {
    constructor(@InjectRepository(RecipeStep) public repository: Repository<RecipeStep>) {
        super();
    }

    async updateStatus(id: number, status: number): Promise<{ data: RecipeStep, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as RecipeStep,
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

    async recipeList(alias: string, recipeStepFilterDto: RecipeStepFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeStepFilterDto.recipeId)
            builder.where(alias + ".recipeId = :s and " + alias + ".status = :status", { s: recipeStepFilterDto.recipeId, status: `${Status.Active}` })
        else
            builder.where(alias + ".status = :status", { status: `${Status.Active}` })

        const sort: any = recipeStepFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeStepFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeStepFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];

        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeStepMapper.ModelToDto(item));
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
}