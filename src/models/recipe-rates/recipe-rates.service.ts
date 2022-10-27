import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Status, UserType, YesNo } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Recipe } from '../recipe/recipe.entity';
import { CreateRecipeRatesDto, UpdateRecipeRates, FilterRecipeRatesDto, RecipeRatesDto } from "./recipe-rates.dtos";
import { RecipeRates } from './recipe-rates.entity';
import { RecipeRatesMapper } from './recipe-rates.mapper';

@Injectable()
export class RecipeRatesService extends BaseService<RecipeRates, CreateRecipeRatesDto, UpdateRecipeRates, RecipeRatesDto> {

  constructor(@InjectRepository(RecipeRates) public repository: Repository<RecipeRates>, @InjectRepository(Recipe) public recipeRepository: Repository<Recipe>) {
    super();
  };

  async _create(user: User, createDto: CreateRecipeRatesDto): Promise<{ data: RecipeRates, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      createDto.userId = user.id;
      const getControlData = await this.repository.findOne({ where: { status: Status.Active, recipeId: createDto.recipeId, userId: user.id } });
      let res = null;
      if (getControlData) {
        res = await this.repository.delete(getControlData.id);
        const getRecipeDetail = await this.recipeRepository.findOne(createDto.recipeId);
        const lastRateCount = (getRecipeDetail.rateCount - 1);
        const lastRateSum = (getRecipeDetail.rateSum - getControlData.rateType);
        const lastRateAvg = (lastRateSum / lastRateCount);
        await this.recipeRepository.update(createDto.recipeId, { rateCount: lastRateCount, rateSum: lastRateSum, rateAvg: lastRateAvg });
      }
      else {
        res = await this.repository.insert(createDto);
        const getRecipeDetail = await this.recipeRepository.findOne(createDto.recipeId);
        const lastRateCount = (getRecipeDetail.rateCount + 1);
        const lastRateSum = (getRecipeDetail.rateSum + createDto.rateType);
        const lastRateAvg = (lastRateSum / lastRateCount);
        await this.recipeRepository.update(createDto.recipeId, { rateCount: lastRateCount, rateSum: lastRateSum, rateAvg: lastRateAvg });
      }
      const resData = getControlData ? null : await this.repository.findOne(res.identifiers[0].id);
      return {
        data: resData as RecipeRates,
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

  async _list(user: User, alias: string, filterRecipeRatesDto: FilterRecipeRatesDto) {
    const builder = await this.repository.createQueryBuilder(alias);
    if (filterRecipeRatesDto.id)
      builder.where(alias + ".id = :s", { s: `${filterRecipeRatesDto.id}` })
    if (user.userType != UserType.Admin)
      builder.where(alias + ".userId = :s", { s: `${user.id}` })
    if (filterRecipeRatesDto.recipeId)
      builder.where(alias + ".recipeId = :s", { s: `${filterRecipeRatesDto.recipeId}` })
    if (filterRecipeRatesDto.rateType)
      builder.where(alias + ".rateType = :s", { s: `${filterRecipeRatesDto.rateType}` })
    if (filterRecipeRatesDto.status)
      builder.where(alias + ".status = :s", { s: `${filterRecipeRatesDto.status}` })
    else
      builder.where(alias + ".status != :s", { s: `${Status.Deleted}` })

    const sort: any = filterRecipeRatesDto.sortby;

    if (sort)
      builder.orderBy(alias + '.id', sort.order.toUpperCase());
    else
      builder.orderBy(alias + '.id', "DESC");

    const page: number = parseInt(filterRecipeRatesDto.page as any) || 1;
    const perPage: number = parseInt(filterRecipeRatesDto.limit as any) || 10;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    const data = await builder.getMany();
    const responseData = [];
    data.forEach(item => {
      responseData.push(RecipeRatesMapper.ModelToDto(item));
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
  };

  async recipeList(filterRecipeRatesDto: FilterRecipeRatesDto) {
    const alias = "recipe_rates";
    const builder = await this.repository.createQueryBuilder(alias);
    if (filterRecipeRatesDto.id)
      builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${filterRecipeRatesDto.id}`, status: Status.Deleted })
    else
      builder.where(alias + ".recipeId = :s AND " + alias + ".status = :status", { s: `${filterRecipeRatesDto.recipeId}`, status: Status.Active })

    builder.relation("recipe");
    builder.relation("user");

    builder.leftJoinAndSelect(alias + ".recipe", "recipe")
    builder.leftJoinAndSelect(alias + ".user", "user")

    const sort: any = filterRecipeRatesDto.sortby;

    if (sort)
      builder.orderBy(alias + '.' + sort.key, sort.order.toUpperCase());
    else
      builder.orderBy(alias + '.id', "DESC");

    const page: number = parseInt(filterRecipeRatesDto.page as any) || 1;
    const perPage: number = parseInt(filterRecipeRatesDto.limit as any) || 10;
    const total = await builder.getCount();
    builder.offset((page - 1) * perPage).limit(perPage);

    const data = await builder.getMany();
    const responseData = [];
    await Promise.all(
      data.map(async (item: any) => {
        responseData.push(RecipeRatesMapper.ModelToDto(item));
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

};
