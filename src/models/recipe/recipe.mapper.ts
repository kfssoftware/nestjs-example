import { Recipe } from './recipe.entity';
import { RecipeDto } from './recipe.dtos';
import { plainToClass } from 'class-transformer';
import { ServiceTypeLabel, TimeTypeLabel } from 'src/common/enums';

export class RecipeMapper {
  public static ModelToDto(recipe: Recipe, rated = false, favorited = false, saved = false, userFollowed = false) {
    var recipeModel = new RecipeDto();
    var serviceTypeLabel: any = ServiceTypeLabel;
    var timeTypeLabel: any = TimeTypeLabel;
    Object.keys(plainToClass(RecipeDto, recipe)).forEach(value => {
      recipeModel[value] = recipe[value]
    });
    recipeModel.serviceTypeName = serviceTypeLabel.get(Number(recipe.serviceType));
    recipeModel.preparationTimeTypeName = timeTypeLabel.get(Number(recipe.preparationTimeType));
    recipeModel.cookingTimeTypeName = timeTypeLabel.get(Number(recipe.cookingTimeType));
    recipeModel.rated = rated;
    recipeModel.favorited = favorited;
    recipeModel.saved = saved;
    recipeModel.userFollowed = userFollowed;
    return recipeModel;
  }
}