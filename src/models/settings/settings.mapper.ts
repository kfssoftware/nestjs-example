import { plainToClass } from 'class-transformer';
import { Settings } from './settings.entity';
import { SettingsDto } from './settings.dtos';

export class SettingsMapper {
  public static ModelToDto(Settings: Settings) {
    var SettingsModel = new SettingsDto();
    Object.keys(plainToClass(SettingsDto, Settings)).forEach(value => {
      SettingsModel[value] = Settings[value]
    });
    return SettingsModel;
  };
};