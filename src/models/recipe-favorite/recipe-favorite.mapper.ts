import { RecipeFavorite } from './recipe-favorite.entity';
import { RecipeFavoriteDto } from './recipe-favorite.dtos';
import { plainToClass } from 'class-transformer';

export class RecipeFavoriteMapper {
  public static ModelToDto(recipeFavorite: RecipeFavorite) {
    var recipeFavoriteModel = new RecipeFavoriteDto();
    Object.keys(plainToClass(RecipeFavoriteDto, recipeFavorite)).forEach(value => {
      recipeFavoriteModel[value] = recipeFavorite[value];
    });
    return recipeFavoriteModel;
  };
};