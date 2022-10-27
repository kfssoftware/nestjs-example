import { RecipeComment } from './recipe-comment.entity';
import { RecipeCommentDto } from './recipe-comment.dtos';
import { plainToClass } from 'class-transformer';

export class RecipeCommentMapper {
  public static ModelToDto(recipeComment: RecipeComment) {
    var recipeCommentModel = new RecipeCommentDto();
    Object.keys(plainToClass(RecipeCommentDto, recipeComment)).forEach(value => {
      recipeCommentModel[value] = recipeComment[value];
    });
    return recipeCommentModel;
  };
};