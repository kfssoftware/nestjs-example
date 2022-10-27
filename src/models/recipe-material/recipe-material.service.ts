import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { Status } from "src/common/enums";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import { CreateRecipeMaterialDto, RecipeMaterialDto, RecipeMaterialFilterDto, UpdateRecipeMaterialDto } from "./recipe-material.dtos";
import { RecipeMaterial } from "./recipe-material.entity";
import { RecipeMaterialMapper } from "./recipe-material.mapper";

@Injectable()
export class RecipeMaterialService extends BaseService<
    RecipeMaterial,
    CreateRecipeMaterialDto,
    UpdateRecipeMaterialDto,
    RecipeMaterialDto
> {
    constructor(@InjectRepository(RecipeMaterial) public repository: Repository<RecipeMaterial>) {
        super();
    }

    async updateStatus(id: number, status: number): Promise<{ data: RecipeMaterial, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as RecipeMaterial,
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

    async recipeList(alias: string, recipeMaterialFilterDto: RecipeMaterialFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeMaterialFilterDto.recipeId)
            builder.where(alias + ".recipeId = :s and " + alias + ".status = :status", { s: recipeMaterialFilterDto.recipeId, status: `${Status.Active}` })
        else
            builder.where(alias + ".status = :status", { status: `${Status.Active}` })

        builder.relation("material");
        builder.leftJoinAndSelect(alias + ".material", "material")

        const sort: any = recipeMaterialFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeMaterialFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeMaterialFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];

        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeMaterialMapper.ModelToDto(item));
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