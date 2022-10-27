import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';

export class CreateDataTranslateDto {
  @ApiProperty() keyword: string;

  @ApiProperty() translateList: Array<object>;

  constructor(object: any) {
    Object.assign(this, object);
  }
}


export class DataTranslateFilterDto extends BaseFilterDto {
  @ApiProperty() languageId: number;

  @ApiProperty() keyword: string;

  @ApiProperty() value: string;
}

import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';
export class UpdateDataTranslateDto extends PartialType(CreateDataTranslateDto) {}

export class DataTranslateDto extends BaseListDto {
  @ApiProperty()
  languageId: number;

  @ApiProperty({ nullable: true })
  keyword: string;

  @ApiProperty({ nullable: true })
  value: string;
};