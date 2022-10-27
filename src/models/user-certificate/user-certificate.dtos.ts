import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';

export class CreateUserCertificateDto {
  @ApiProperty() userId: number;

  @ApiProperty() certificateUrl: string;

  @ApiProperty() description: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateUserCertificateDto extends PartialType(CreateUserCertificateDto) { }

export class UserCertificateDto extends BaseListDto {
  @ApiProperty()
  userId: number;

  @ApiProperty({ type: 'text', nullable: true })
  certificateUrl: string;

  @ApiProperty({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  confirm: boolean;
}