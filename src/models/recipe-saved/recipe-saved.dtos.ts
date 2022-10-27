import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { BaseListDto } from '../base/base.list.dto';

export class CreateRecipeSavedDto {

  @ApiProperty() recipeId: number;

  @ApiProperty() userId: number;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class RecipeSavedFilterDto extends BaseFilterDto {
  @ApiProperty() recipeId: number;
}

export class UpdateRecipeSavedDto extends PartialType(CreateRecipeSavedDto) { }

export class RecipeSavedDto extends BaseListDto {
  @ApiProperty() recipeId: number;

  @ApiProperty() userId: number;
}