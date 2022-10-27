import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { BaseListDto } from '../base/base.list.dto';

export class CreateRecipeFavoriteDto {

  @ApiProperty() recipeId: number;

  @ApiProperty() userId: number;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class RecipeFavoriteFilterDto extends BaseFilterDto {
  @ApiProperty() recipeId: number;
}

export class UpdateRecipeFavoriteDto extends PartialType(CreateRecipeFavoriteDto) { }

export class RecipeFavoriteDto extends BaseListDto {
  @ApiProperty() recipeId: number;

  @ApiProperty() userId: number;
}