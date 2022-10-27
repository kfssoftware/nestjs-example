import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRecipeFavoriteDto, RecipeFavoriteFilterDto, UpdateRecipeFavoriteDto } from "./recipe-favorite.dtos";
import { RecipeFavoriteService } from './recipe-favorite.service';

@Controller('RecipeFavorite')
export class RecipeFavoriteController {
  constructor(private readonly recipeFavoriteService: RecipeFavoriteService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createRecipeFavoriteDto: CreateRecipeFavoriteDto) {
    if (createRecipeFavoriteDto.recipeId == null)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.recipe_not_found"
      );
    else
      return this.recipeFavoriteService._create(req.user, createRecipeFavoriteDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeList)
  list() {
    return this.recipeFavoriteService.list();
  }

  @Post('recipeList')
  @UseGuards(JwtAuthGuard)
  recipeList(@Request() req, @Body() recipeFavoriteFilterDto: RecipeFavoriteFilterDto) {
    return this.recipeFavoriteService.recipeList(req.user, recipeFavoriteFilterDto);
  }

  @Post('recipeGeneralList')
  recipeGeneralList(@Body() recipeFavoriteFilterDto: RecipeFavoriteFilterDto) {
    return this.recipeFavoriteService.recipeGeneralList(recipeFavoriteFilterDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.recipeFavoriteService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeFavoriteDto: UpdateRecipeFavoriteDto) {
    return this.recipeFavoriteService.update(+id, updateRecipeFavoriteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RecipeDelete)
  delete(@Param('id') id: string) {
    return this.recipeFavoriteService.delete(+id);
  }
}
