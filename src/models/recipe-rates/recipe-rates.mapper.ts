import { plainToClass } from "class-transformer";
import { YesNoLabel } from "src/common/enums";
import { RecipeRatesDto } from "./recipe-rates.dtos";
import { RecipeRates } from "./recipe-rates.entity";

export class RecipeRatesMapper {

  public static ModelToDto(recipeRates: RecipeRates) {
    var recipeRatesModel = new RecipeRatesDto();
    Object.keys(plainToClass(RecipeRatesDto, recipeRates)).forEach(value => {
      recipeRatesModel[value] = recipeRates[value];
    });
    return recipeRatesModel;
  };
};