import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRecipeRatesDto, FilterRecipeRatesDto } from "./recipe-rates.dtos";
import { RecipeRatesService } from './recipe-rates.service';

@Controller("RecipeRates")
export class RecipeRatesController {

  constructor(private readonly recipeRatesService: RecipeRatesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createRecipeRatesDto: CreateRecipeRatesDto) {
    return this.recipeRatesService._create(req.user, createRecipeRatesDto);
  };

  @Post('recipeList')
  recipeList(@Body() filterRecipeRatesDto: FilterRecipeRatesDto) {
    return this.recipeRatesService.recipeList(filterRecipeRatesDto);
  }

  @Post("list")
  @UseGuards(JwtAuthGuard)
  list(@Request() req, @Body() filterRecipeRatesDto: FilterRecipeRatesDto) {
    return this.recipeRatesService._list(req.user, "recipe_rates", filterRecipeRatesDto);
  };
};
