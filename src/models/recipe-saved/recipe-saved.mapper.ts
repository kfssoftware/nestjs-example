import { RecipeSaved } from './recipe-saved.entity';
import { RecipeSavedDto } from './recipe-saved.dtos';
import { plainToClass } from 'class-transformer';

export class RecipeSavedMapper {
  public static ModelToDto(recipeSaved: RecipeSaved) {
    var recipeSavedModel = new RecipeSavedDto();
    Object.keys(plainToClass(RecipeSavedDto, recipeSaved)).forEach(value => {
      recipeSavedModel[value] = recipeSaved[value];
    });
    return recipeSavedModel;
  };
};