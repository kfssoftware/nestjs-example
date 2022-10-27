import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRecipeSavedDto, RecipeSavedFilterDto, UpdateRecipeSavedDto } from "./recipe-saved.dtos";
import { RecipeSavedService } from './recipe-saved.service';

@Controller('RecipeSaved')
export class RecipeSavedController {
  constructor(private readonly recipeSavedService: RecipeSavedService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createRecipeSavedDto: CreateRecipeSavedDto) {
    if (createRecipeSavedDto.recipeId == null)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.recipe_not_found"
      );
    else
      return this.recipeSavedService._create(req.user, createRecipeSavedDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeList)
  list() {
    return this.recipeSavedService.list();
  }

  @Post('recipeList')
  @UseGuards(JwtAuthGuard)
  recipeList(@Request() req, @Body() recipeSavedFilterDto: RecipeSavedFilterDto) {
    return this.recipeSavedService.recipeList(req.user, recipeSavedFilterDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.recipeSavedService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeSavedDto: UpdateRecipeSavedDto) {
    return this.recipeSavedService.update(+id, updateRecipeSavedDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeDelete)
  delete(@Param('id') id: string) {
    return this.recipeSavedService.delete(+id);
  }
}
