import { ApiProperty } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';
import { BaseFilterDto } from '../base/base.filter.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty() name: string;

  @ApiProperty() fullName: string;

  @ApiProperty() parentLocation: number;

  @ApiProperty() parentLocationName: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}


export class ListLocationDto extends BaseListDto {
  @ApiProperty() name: string;

  @ApiProperty() fullName: string;

  @ApiProperty() parentLocationId: number;

  @ApiProperty() parentLocationName: string;
}


export class LocationFilterDto extends BaseFilterDto {
  @ApiProperty() parentLocationId: number;
  
  @ApiProperty() name: string;

}
export class UpdateLocationDto extends PartialType(CreateLocationDto) { }

export class LocationDto extends BaseListDto {
  @ApiProperty({ maxLength: 50 })
  name: string;

  @ApiProperty() parentLocationId: number;

  @ApiProperty() parentLocationName: string;

  @ApiProperty({ maxLength: 250 })
  fullName: string;
}