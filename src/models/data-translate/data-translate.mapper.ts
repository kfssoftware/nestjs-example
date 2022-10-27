import { DataTranslate } from './data-translate.entity';
import { DataTranslateDto } from './data-translate.dtos';
import { plainToClass } from 'class-transformer';

export class DataTranslateMapper {
  public static ModelToDto(dataTranslate: DataTranslate) {
    var dataTranslateModel = new DataTranslateDto();
    Object.keys(plainToClass(DataTranslateDto, dataTranslate)).forEach(value => {
      dataTranslateModel[value] = dataTranslate[value]
    });
    return dataTranslateModel;
  }
}