import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRecipeStepDto, RecipeStepFilterDto, UpdateRecipeStepDto } from "./recipe-step.dtos";
import { RecipeStepService } from './recipe-step.service';

@Controller('RecipeStep')
export class RecipeStepController {
  constructor(private readonly recipeStepService: RecipeStepService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRecipeStepDto: CreateRecipeStepDto) {
    if (createRecipeStepDto.recipeId == null)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.recipe_not_found"
      );
    else
      return this.recipeStepService.create(createRecipeStepDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeList)
  list() {
    return this.recipeStepService.list();
  }

  @Post('recipeList')
  recipeList(@Body() recipeStepFilterDto: RecipeStepFilterDto) {
    return this.recipeStepService.recipeList("recipe_step",recipeStepFilterDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.recipeStepService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeStepDto: UpdateRecipeStepDto) {
    return this.recipeStepService.update(+id, updateRecipeStepDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeDelete)
  delete(@Param('id') id: string) {
    return this.recipeStepService.delete(+id);
  }
}
