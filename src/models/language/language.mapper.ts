import { Language } from './language.entity';
import { LanguageDto } from './language.dtos';
import { plainToClass } from 'class-transformer';

export class LanguageMapper {
  public static ModelToDto(language: Language) {
    var languageModel = new LanguageDto();
    Object.keys(plainToClass(LanguageDto, language)).forEach(value => {
      languageModel[value] = language[value]
    });
    return languageModel;
  }
}