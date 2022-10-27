import { ApiProperty, PartialType } from "@nestjs/swagger";
import { YesNo } from "src/common/enums";
import { BaseFilterDto } from "../base/base.filter.dto";

export class CreateRecipeRatesDto {
  @ApiProperty({ nullable: true, required: false }) userId: number;
  @ApiProperty() recipeId: number;
  @ApiProperty() rateType: number;
};


export class FilterRecipeRatesDto extends BaseFilterDto {
  @ApiProperty() recipeId: number;
  @ApiProperty() userId?: number;
  @ApiProperty() rateType?: number;
}

export class UpdateRecipeRates { };

export class RecipeRatesDto {

  @ApiProperty()
  userId: number;

  @ApiProperty()
  recipeId: number;

  @ApiProperty()
  rateType: number;

};