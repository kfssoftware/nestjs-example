import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRecipeCommentDto, RecipeCommentFilterDto, UpdateRecipeCommentDto } from "./recipe-comment.dtos";
import { RecipeCommentService } from './recipe-comment.service';

@Controller('RecipeComment')
export class RecipeCommentController {
  constructor(private readonly recipeCommentService: RecipeCommentService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRecipeCommentDto: CreateRecipeCommentDto) {
    if (createRecipeCommentDto.recipeId == null)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.recipe_not_found"
      );
    else
      return this.recipeCommentService.create(createRecipeCommentDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeList)
  list() {
    return this.recipeCommentService.list();
  }

  @Post('recipeList')
  recipeList(@Body() recipeCommentFilterDto: RecipeCommentFilterDto) {
    return this.recipeCommentService.recipeList(recipeCommentFilterDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.recipeCommentService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeCommentDto: UpdateRecipeCommentDto) {
    return this.recipeCommentService.update(+id, updateRecipeCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeDelete)
  delete(@Param('id') id: string) {
    return this.recipeCommentService.delete(+id);
  }
}
