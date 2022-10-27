import { Location } from './location.entity';
import { LocationDto } from './location.dtos';
import { plainToClass } from 'class-transformer';

export class LocationMapper {
  public static ModelToDto(location: Location) {
    var locationModel = new LocationDto();
    Object.keys(plainToClass(LocationDto, location)).forEach(value => {
      locationModel[value] = location[value]
    });
    return locationModel;
  }
}