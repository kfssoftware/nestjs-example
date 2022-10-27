import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { BaseListDto } from '../base/base.list.dto';

export class CreateRecipeStepDto {

  @ApiProperty() recipeId: number;

  @ApiProperty() description: string;

  @ApiProperty() imageUrl: string;

  @ApiProperty() optional: Boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateRecipeStepDto extends PartialType(CreateRecipeStepDto) { }

export class RecipeStepFilterDto extends BaseFilterDto {
  @ApiProperty() recipeId: number;
}

export class RecipeStepDto extends BaseListDto {
  @ApiProperty()
  recipeId: number;

  @ApiProperty() description: string;

  @ApiProperty() imageUrl: string;

  @ApiProperty() optional: Boolean;
}