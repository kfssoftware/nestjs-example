import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { BaseListDto } from '../base/base.list.dto';

export class CreateRecipeCommentDto {

  @ApiProperty() userId: number;

  @ApiProperty() recipeId: number;

  @ApiProperty() description: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class RecipeCommentFilterDto extends BaseFilterDto {
  @ApiProperty() recipeId: number;
}

export class UpdateRecipeCommentDto extends PartialType(CreateRecipeCommentDto) { }


export class RecipeCommentDto extends BaseListDto {
  @ApiProperty() userId: number;

  @ApiProperty() recipeId: number;

  @ApiProperty() description: string;
}