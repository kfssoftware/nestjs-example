import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRecipeMaterialDto, RecipeMaterialFilterDto, UpdateRecipeMaterialDto } from "./recipe-material.dtos";
import { RecipeMaterialService } from './recipe-material.service';

@Controller('RecipeMaterial')
export class RecipeMaterialController {
  constructor(private readonly recipeMaterialService: RecipeMaterialService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRecipeMaterialDto: CreateRecipeMaterialDto) {
    if (createRecipeMaterialDto.recipeId == null)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.recipe_not_found"
      );
    else
      return this.recipeMaterialService.create(createRecipeMaterialDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeList)
  list() {
    return this.recipeMaterialService.list();
  }

  @Post('recipeList')
  recipeList(@Body() recipeMaterialFilterDto: RecipeMaterialFilterDto) {
    return this.recipeMaterialService.recipeList("recipe_material",recipeMaterialFilterDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.recipeMaterialService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeMaterialDto: UpdateRecipeMaterialDto) {
    return this.recipeMaterialService.update(+id, updateRecipeMaterialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeDelete)
  delete(@Param('id') id: string) {
    return this.recipeMaterialService.delete(+id);
  }
}
