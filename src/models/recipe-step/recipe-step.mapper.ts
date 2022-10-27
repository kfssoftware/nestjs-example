import { RecipeStep } from './recipe-step.entity';
import { RecipeStepDto } from './recipe-step.dtos';
import { plainToClass } from 'class-transformer';

export class RecipeStepMapper {
  public static ModelToDto(recipeStep: RecipeStep) {
    var recipeStepModel = new RecipeStepDto();
    Object.keys(plainToClass(RecipeStepDto, recipeStep)).forEach(value => {
      recipeStepModel[value] = recipeStep[value];
    });
    return recipeStepModel;
  };
};