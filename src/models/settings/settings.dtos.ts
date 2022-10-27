
import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';
import { Settings } from './settings.entity';

export class CreateSettingsDto {

  @ApiProperty({ nullable: true })
  currency: string;

  @ApiProperty({ nullable: true })
  taxNo: string;

  @ApiProperty({ nullable: true })
  taxAdministration: string;

  @ApiProperty({ nullable: true })
  siteTitle: string;

  @ApiProperty({ nullable: true })
  phone: string;

  @ApiProperty({ nullable: true })
  phone2: string;

  @ApiProperty({ nullable: true })
  facebook: string;

  @ApiProperty({ nullable: true })
  twitter: string;

  @ApiProperty({ nullable: true })
  instagram: string;

  @ApiProperty({ nullable: true })
  facebookApp: string;

  @ApiProperty({ nullable: true })
  twitterApp: string;

  @ApiProperty({ nullable: true })
  instagramApp: string;

  @ApiProperty({ nullable: true })
  website: string;

  @ApiProperty({ nullable: true })
  state: string;

  @ApiProperty({ nullable: true })
  country: string;

  @ApiProperty({ nullable: true })
  address: string;

  @ApiProperty({ nullable: true })
  language: string;

  @ApiProperty({ nullable: true })
  privacy: string;

  @ApiProperty({ nullable: true })
  mail: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class SettingsFilterDto extends BaseFilterDto {

  @ApiProperty({ nullable: true })
  currency: string;

  @ApiProperty({ nullable: true })
  taxNo: string;

  @ApiProperty({ nullable: true })
  taxAdministration: string;

  @ApiProperty({ nullable: true })
  siteTitle: string;

  @ApiProperty({ nullable: true })
  phone: string;

  @ApiProperty({ nullable: true })
  phone2: string;

  @ApiProperty({ nullable: true })
  facebook: string;

  @ApiProperty({ nullable: true })
  twitter: string;

  @ApiProperty({ nullable: true })
  instagram: string;

  @ApiProperty({ nullable: true })
  facebookApp: string;

  @ApiProperty({ nullable: true })
  twitterApp: string;

  @ApiProperty({ nullable: true })
  instagramApp: string;

  @ApiProperty({ nullable: true })
  website: string;

  @ApiProperty({ nullable: true })
  state: string;

  @ApiProperty({ nullable: true })
  country: string;

  @ApiProperty({ nullable: true })
  address: string;

  @ApiProperty({ nullable: true })
  language: string;

  @ApiProperty({ nullable: true })
  privacy: string;

  @ApiProperty({ nullable: true })
  mail: string;
}

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) { }

export class SettingsDto extends BaseListDto {
  @ApiProperty({ nullable: true })
  currency: string;

  @ApiProperty({ nullable: true })
  taxNo: string;

  @ApiProperty({ nullable: true })
  taxAdministration: string;

  @ApiProperty({ nullable: true })
  siteTitle: string;

  @ApiProperty({ nullable: true })
  phone: string;

  @ApiProperty({ nullable: true })
  phone2: string;

  @ApiProperty({ nullable: true })
  facebook: string;

  @ApiProperty({ nullable: true })
  twitter: string;

  @ApiProperty({ nullable: true })
  instagram: string;

  @ApiProperty({ nullable: true })
  facebookApp: string;

  @ApiProperty({ nullable: true })
  twitterApp: string;

  @ApiProperty({ nullable: true })
  instagramApp: string;

  @ApiProperty({ nullable: true })
  website: string;

  @ApiProperty({ nullable: true })
  state: string;

  @ApiProperty({ nullable: true })
  country: string;

  @ApiProperty({ nullable: true })
  address: string;

  @ApiProperty({ nullable: true })
  language: string;

  @ApiProperty({ nullable: true })
  privacy: string;

  @ApiProperty({ nullable: true })
  mail: string;
};