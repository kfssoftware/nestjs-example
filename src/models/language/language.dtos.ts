import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
export class CreateLanguageDto {
  @ApiProperty() name: string;

  @ApiProperty() shortName: string;

  @ApiProperty() isRtl: boolean

  @ApiProperty() isDefault: boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class LanguageFilterDto extends BaseFilterDto {

  @ApiProperty() name: string;

  @ApiProperty() shortName: string;

}

import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';
export class UpdateLanguageDto extends PartialType(CreateLanguageDto) { }

export class LanguageDto extends BaseListDto {
  @ApiProperty({ maxLength: 30 })
  name: string;

  @ApiProperty({ maxLength: 5 })
  shortName: string;

  @ApiProperty()
  isRtl: boolean;

  @ApiProperty()
  isDefault: boolean;
};