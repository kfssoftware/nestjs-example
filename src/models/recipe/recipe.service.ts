import { HttpStatus, Injectable, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { DocumentType, NotificationType, Status, TemplateType, UserType } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { IsNull, Not, Repository } from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import * as admin from 'firebase-admin';
import { CreateRecipeMaterialDto } from '../recipe-material/recipe-material.dtos';
import { RecipeMaterial } from '../recipe-material/recipe-material.entity';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto, RecipeFilterDto, RecipeDto, RecipeDetailByUserDto } from "./recipe.dtos";
import { RecipeMapper } from './recipe.mapper';
import { General } from 'src/common/general';
import { DataTranslate } from '../data-translate/data-translate.entity';
import { InjectExpo } from 'nestjs-expo-sdk';
import { NotificationTokens } from '../notification-tokens/notification-tokens.entity';
import { MailDto } from '../mail/mail.dtos';
import { MailService } from '../mail/mail.service';
import { CreateRecipeStepDto } from '../recipe-step/recipe-step.dtos';
import { RecipeStep } from '../recipe-step/recipe-step.entity';
import { RecipeComment } from '../recipe-comment/recipe-comment.entity';
import { RecipeRates } from '../recipe-rates/recipe-rates.entity';
import { MaterialMapper } from '../material/material.mapper';
import { RecipeMaterialMapper } from '../recipe-material/recipe-material.mapper';
import { UserFollow } from '../user-follow/user-follow.entity';
import { RecipeFavorite } from '../recipe-favorite/recipe-favorite.entity';
import { RecipeSaved } from '../recipe-saved/recipe-saved.entity';

@Injectable()
export class RecipeService extends BaseService<
    Recipe,
    CreateRecipeDto,
    UpdateRecipeDto,
    RecipeDto
> {
    constructor(
        public mailService: MailService,
        @InjectRepository(Recipe) public repository: Repository<Recipe>,
        @InjectRepository(RecipeMaterial) public recipeMaterialRepository: Repository<RecipeMaterial>,
        @InjectRepository(RecipeStep) public recipeStepRepository: Repository<RecipeStep>,
        @InjectRepository(RecipeComment) public recipeCommentRepository: Repository<RecipeComment>,
        @InjectRepository(RecipeRates) public recipeRateRepository: Repository<RecipeRates>,
        @InjectRepository(RecipeSaved) public recipeSavedRepository: Repository<RecipeSaved>,
        @InjectRepository(RecipeFavorite) public recipeFavoriteRepository: Repository<RecipeFavorite>,
        @InjectRepository(UserFollow) public userFollowRepository: Repository<UserFollow>,
        @InjectRepository(Category) public categoryRepository: Repository<Category>,
        @InjectRepository(User) public userRepository: Repository<User>,
        @InjectRepository(DataTranslate) public dataTranslateRepository: Repository<DataTranslate>,
        @InjectExpo() private expo: any
    ) {
        super();
    }

    async _create(user: User, createDto: CreateRecipeDto): Promise<{ data: Recipe, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            createDto.userId = user.id;
            if (user.userType === UserType.Admin) createDto.confirm = true; else createDto.confirm = false;
            const res = await this.repository.insert(createDto);
            if (createDto?.materials && createDto?.materials.length > 0) {
                createDto?.materials?.map(async (item) => {
                    const createRecipeMaterialParams = {} as CreateRecipeMaterialDto;
                    createRecipeMaterialParams.recipeId = res.identifiers[0].id;
                    createRecipeMaterialParams.materialId = item.materialId;
                    createRecipeMaterialParams.quantity = item.quantity;
                    createRecipeMaterialParams.quantityType = item.quantityType;
                    createRecipeMaterialParams.optional = item.optional;
                    createRecipeMaterialParams.aim = item.aim;
                    await this.recipeMaterialRepository.insert(createRecipeMaterialParams)
                });
            }
            if (createDto?.steps && createDto?.steps.length > 0) {
                createDto?.steps?.map(async (item) => {
                    const createRecipeStepParams = {} as CreateRecipeStepDto;
                    createRecipeStepParams.recipeId = res.identifiers[0].id;
                    createRecipeStepParams.description = item.description;
                    createRecipeStepParams.imageUrl = item.imageUrl;
                    createRecipeStepParams.optional = item.optional;
                    await this.recipeStepRepository.insert(createRecipeStepParams)
                });
            }
            const resData = await this.repository.findOne(res.identifiers[0].id);
            return {
                data: resData as Recipe,
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

    async confirm(id: number): Promise<{ data: Recipe, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { confirm: true });
            const resData = await this.repository.findOne(id);
            //notification start

            //notification end
            return {
                data: resData as Recipe,
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

    async updateStatus(id: number, status: number): Promise<{ data: Recipe, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as Recipe,
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

    async seoLinkToId(recipeFilterDto: RecipeFilterDto) {
        const data = await this.repository.findOne({ where: { seoLink: recipeFilterDto.seoLink } });
        if (!data) {
            throw new ResException(
                HttpStatus.NOT_FOUND,
                "general.recipe_not_found"
            );
        }
        let resData = RecipeMapper.ModelToDto(data);
        return {
            data: resData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null
        };
    }

    async monthlyRecipes(alias: string) {
        const builder = await this.repository.createQueryBuilder(alias);
        builder.where(alias + ".status = :s AND " + alias + ".confirm = :c", { s: `${Status.Active}`, c: true })

        builder.relation("category");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        builder.orderBy(alias + '.viewCount', "DESC");
        builder.limit(3);
        const data = await builder.getMany();

        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
            }));

        return {
            data: responseData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total: 0,
            page: 0,
            pageCount: Math.ceil(0 / 0)
        };
    }

    async popularRecipes(alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        builder.where(alias + ".status = :s AND " + alias + ".confirm = :c", { s: `${Status.Active}`, c: true })

        builder.relation("category");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        builder.orderBy(alias + '.id', "DESC");
        const sort: any = recipeFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();

        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
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

    async newRecipes(alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        builder.where(alias + ".status = :s AND " + alias + ".confirm = :c", { s: `${Status.Active}`, c: true })

        builder.relation("category");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        builder.orderBy(alias + '.id', "DESC");
        const sort: any = recipeFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();

        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
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

    async weekList(alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        builder.where(alias + ".status = :s AND " + alias + ".confirm = :c", { s: `${Status.Active}`, c: true })
        builder.relation("category");
        builder.relation("user");
        builder.relation("recipe_rates");
        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")
        const sort: any = recipeFilterDto.sortby;
        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
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

    async _list(user: User, alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeFilterDto.id}`, status: Status.Deleted })
        else {
            if (recipeFilterDto.status)
                builder.where(alias + ".status = :status", { status: `${recipeFilterDto.status}` })
            else
                if (user.userType == UserType.Admin)
                    builder.where(alias + ".status != :status", { status: `${Status.Deleted}` })
                else
                    builder.where(alias + ".status = :status", { status: `${Status.Active}` })

            if (recipeFilterDto.userId)
                builder.where(alias + ".userId = :userId AND " + alias + ".status = :status", { userId: recipeFilterDto.userId, status: `${Status.Active}` })

            if (recipeFilterDto.categoryId)
                builder.where(alias + ".userId = :categoryId AND " + alias + ".status = :status", { userId: recipeFilterDto.categoryId, status: `${Status.Active}` })

            if (recipeFilterDto.search)
                builder.where("(LOWER(" + alias + ".title) LIKE :s OR LOWER(" + alias + ".description) LIKE :s) AND " + alias + ".status = :status", { s: `%${recipeFilterDto.search.toLowerCase()}%`, status: `${Status.Active}` })

            if (recipeFilterDto.title)
                builder.where("(LOWER(" + alias + ".title) LIKE :s) AND " + alias + ".status = :status", { s: `%${recipeFilterDto.title.toLowerCase()}%`, status: `${Status.Active}` })

            if (recipeFilterDto.description)
                builder.where("(LOWER(" + alias + ".description) LIKE :s) AND " + alias + ".status = :status", { s: `%${recipeFilterDto.description.toLowerCase()}%`, status: `${Status.Active}` })
        }

        builder.relation("category");
        builder.relation("user");
        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();

        const responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData.push(RecipeMapper.ModelToDto(item));
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

    async flow(user: User, alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeFilterDto.id}`, status: Status.Deleted })
        else {
            const getFollowedList = await this.userFollowRepository.find({ select: ['otherUserId'], where: { userId: user.id } });
            let followedIds = [];
            await Promise.all(
                getFollowedList.map(async (item: any) => {
                    followedIds.push(item.otherUserId);
                }));
            builder.where(alias + ".userId IN (:...userIds) AND " + alias + ".status = :status AND " + alias + ".confirm = :confirm", { userIds: followedIds, status: `${Status.Active}`, confirm: true })

            if (recipeFilterDto.search)
                builder.where(alias + ".userId IN (:...userIds) AND " + alias + ".status = :status AND " + alias + ".confirm = :confirm AND (LOWER(" + alias + ".title) LIKE : s OR LOWER(" + alias + ".description) LIKE : s)", { userIds: followedIds, status: `${Status.Active}`, confirm: true, s: `%${recipeFilterDto.search.toLowerCase()}%` })

            if (recipeFilterDto.title)
                builder.where(alias + ".userId IN (:...userIds) AND " + alias + ".status = :status AND " + alias + ".confirm = :confirm AND (LOWER(" + alias + ".title) LIKE :s)", { userIds: followedIds, status: `${Status.Active}`, confirm: true, s: `%${recipeFilterDto.title.toLowerCase()}%` })

            if (recipeFilterDto.description)
                builder.where(alias + ".userId IN (:...userIds) AND " + alias + ".status = :status AND " + alias + ".confirm = :confirm AND (LOWER(" + alias + ".description) LIKE :s)", { userIds: followedIds, status: `${Status.Active}`, confirm: true, s: `%${recipeFilterDto.description.toLowerCase()}%` })
        }

        builder.relation("category");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFilterDto.sortby;
        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();

        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                const rateInfo = await this.recipeRateRepository.find({ where: { recipeId: item.id, userId: user.id } });
                const favoriteInfo = await this.recipeFavoriteRepository.find({ where: { recipeId: item.id, userId: user.id } });
                const savedInfo = await this.recipeSavedRepository.find({ where: { recipeId: item.id, userId: user.id } });
                const userFollowInfo = await this.userFollowRepository.find({ where: { userId: user.id, otherUserId: item?.user?.Id } });
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item, (rateInfo.length > 0 ? true : false), (favoriteInfo.length > 0 ? true : false), (savedInfo.length > 0 ? true : false), (userFollowInfo.length > 0 ? true : false)), responseData)
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

    async generalList(alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${recipeFilterDto.id}`, status: Status.Deleted })
        else {
            if (recipeFilterDto.status)
                builder.where(alias + ".status = :status AND " + alias + ".confirm = :confirm", { status: `${recipeFilterDto.status}`, confirm: true })
            else
                builder.where(alias + ".status = :status AND " + alias + ".confirm = :confirm", { status: `${Status.Active}`, confirm: true })

            if (recipeFilterDto.userId)
                builder.where(alias + ".userId = :userId AND " + alias + ".status = :status  AND " + alias + ".confirm = :confirm", { userId: recipeFilterDto.userId, status: `${Status.Active}`, confirm: true })

            if (recipeFilterDto.search)
                builder.where("(LOWER(" + alias + ".title) LIKE :s OR LOWER(" + alias + ".description) LIKE :s) AND " + alias + ".status = :status  AND " + alias + ".confirm = :confirm", { s: `%${recipeFilterDto.search.toLowerCase()}%`, status: `${Status.Active}`, confirm: true })

            if (recipeFilterDto.title)
                builder.where("(LOWER(" + alias + ".title) LIKE :s) AND " + alias + ".status = :status  AND " + alias + ".confirm = :confirm", { s: `%${recipeFilterDto.title.toLowerCase()}%`, status: `${Status.Active}`, confirm: true })

            if (recipeFilterDto.description)
                builder.where("(LOWER(" + alias + ".description) LIKE :s) AND " + alias + ".status = :status  AND " + alias + ".confirm = :confirm", { s: `%${recipeFilterDto.description.toLowerCase()}%`, status: `${Status.Active}`, confirm: true })
        }

        builder.relation("category");
        builder.relation("user");
        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFilterDto.sortby;
        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();

        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
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

    async categoryList(alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFilterDto.categoryId)
            builder.where(alias + ".categoryId = :s AND " + alias + ".status = :status", { s: `${recipeFilterDto.categoryId}`, status: Status.Active })
        else {
            builder.where(alias + ".status = :s AND " + alias + ".confirm = :c", { s: `${Status.Active}`, c: true })
        }

        builder.relation("category");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();

        let responseData = [];
        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
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

    async myRecipes(user: User, alias: string, recipeFilterDto: RecipeFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (recipeFilterDto.search)
            builder.where("LOWER(" + alias + ".title) LIKE :s OR LOWER(" + alias + ".description) LIKE :s", { s: `%${recipeFilterDto.search.toLowerCase()}%` })
        else
            builder.where(alias + ".userId = :s and " + alias + ".status = :status AND " + alias + ".confirm = :c", { s: `${user.id}`, status: `${Status.Active}`, c: true })

        builder.relation("category");
        builder.relation("user");

        builder.leftJoinAndSelect(alias + ".category", "category")
        builder.leftJoinAndSelect(alias + ".user", "user")

        const sort: any = recipeFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(recipeFilterDto.page as any) || 1;
        const perPage: number = parseInt(recipeFilterDto.limit as any) || 10;
        const total = await builder.getCount();
        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        let responseData = [];

        await Promise.all(
            data.map(async (item: any) => {
                responseData = this.insertArrayById(RecipeMapper.ModelToDto(item), responseData);
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

    async deleteRecipe(recipeId: number) {
        await this.repository.update(recipeId, { status: Status.Deleted })
        return {
            data: true,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null
        };
    }

    async _detail(recipeId: number) {
        const data = await this.repository.findOne(recipeId, { relations: ["category", "user", "recipeMaterials", "recipeMaterials.material", "recipeSteps"] });
        if (!data) {
            throw new ResException(
                HttpStatus.NOT_FOUND,
                "general.recipe_not_found"
            );
        }
        this.repository.update(recipeId, { viewCount: data.viewCount + 1 });
        let resData = RecipeMapper.ModelToDto(data);
        const responseData = [];
        resData?.recipeMaterials?.forEach(item => {
            responseData.push(RecipeMaterialMapper.ModelToDto(item));
        });
        resData.recipeMaterials = responseData;
        return {
            data: resData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null
        };
    }

    async detailByUser(user: User, recipeId: number) {
        const data = await this.repository.findOne(recipeId, { relations: ["user"] });
        if (!data) {
            throw new ResException(
                HttpStatus.NOT_FOUND,
                "general.recipe_not_found"
            );
        }
        const rateInfo = await this.recipeRateRepository.find({ where: { recipeId: recipeId, userId: user.id } });
        const favoriteInfo = await this.recipeFavoriteRepository.find({ where: { recipeId: recipeId, userId: user.id } });
        const savedInfo = await this.recipeSavedRepository.find({ where: { recipeId: recipeId, userId: user.id } });
        const userFollowInfo = await this.userFollowRepository.find({ where: { userId: user.id, otherUserId: data.userId } });
        if (!data) {
            throw new ResException(
                HttpStatus.NOT_FOUND,
                "general.recipe_not_found"
            );
        }
        const responseData = new RecipeDetailByUserDto();
        responseData.rated = rateInfo.length > 0 ? true : false;
        responseData.favorited = favoriteInfo.length > 0 ? true : false;
        responseData.saved = savedInfo.length > 0 ? true : false;
        responseData.followed = userFollowInfo.length > 0 ? true : false;
        return {
            data: responseData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null
        };
    }

    insertArrayById(element: Object, array: Array<any>) {
        array.push(element);
        array.sort(function (a, b) {
            return b.id - a.id;;
        });
        return array;
    }
}