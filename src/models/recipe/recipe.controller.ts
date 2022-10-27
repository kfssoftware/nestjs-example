import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { RoleActions } from 'src/common/roles.decorator';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto, RecipeDto, RecipeFilterDto } from "./recipe.dtos";
import { AllowAnonymous } from 'src/auth/decorators/allow.anonymous.decarator';


@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService._create(req.user, createRecipeDto);
  }

  @Put('confirm/:id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeUpdate)
  confirmUser(@Param('id') id: string) {
    return this.recipeService.confirm(+id);
  }

  @Post('seoLinkToId')
  seoLinkToId(@Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.seoLinkToId(recipeFilterDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  list(@Request() req, @Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService._list(req.user, 'recipe', recipeFilterDto);
  }

  @Post('generalList')
  generalList(@Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.generalList('recipe', recipeFilterDto);
  }

  @Post('flow')
  @UseGuards(JwtAuthGuard)
  flow(@Request() req, @Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.flow(req.user, 'recipe', recipeFilterDto);
  }

  @Post('weekList')
  weekList(@Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.weekList('recipe', recipeFilterDto);
  }

  @Post('newRecipes')
  newRecipes(@Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.newRecipes('recipe', recipeFilterDto);
  }

  @Post('popularRecipes')
  popularRecipes(@Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.popularRecipes('recipe', recipeFilterDto);
  }

  @Post('monthlyRecipes')
  monthlyRecipes() {
    return this.recipeService.monthlyRecipes('recipe');
  }

  @Post('categoryList')
  categoryList(@Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.categoryList('recipe', recipeFilterDto);
  }

  @Post('myRecipes')
  @UseGuards(JwtAuthGuard)
  myRecipes(@Request() req, @Body() recipeFilterDto: RecipeFilterDto) {
    return this.recipeService.myRecipes(req.user, 'recipe', recipeFilterDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RoleUpdate)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.recipeService.updateStatus(+id, status);
  }

  @Post('dropdown')
  @UseGuards(JwtAuthGuard)
  dropdown() {
    return this.recipeService.dropdown();
  }

  @Get(':id')
  @AllowAnonymous()
  detail(@Param('id') id: string) {
    return this.recipeService._detail(+id);
  }

  @Get('detailByUser/:id')
  @UseGuards(JwtAuthGuard)
  detailByUser(@Request() req, @Param('id') id: string) {
    return this.recipeService.detailByUser(req.user, +id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.recipeService.deleteRecipe(+id);
  }
}
