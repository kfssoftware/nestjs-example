import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { BaseListDto } from '../base/base.list.dto';

export class CreateNotificationTokensDto {
  @ApiProperty({ nullable: true, required: false }) userId: number;

  @ApiProperty({ maxLength: 500 }) token: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class SendNotifDto {
  @ApiProperty({ maxLength: 500 }) title: string;

  @ApiProperty({ maxLength: 500 }) body: string;

  @ApiProperty({ maxLength: 500 }) email: string;

  @ApiProperty({ maxLength: 500 }) data: object;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class FilterNotificationTokensDto extends BaseFilterDto {
};

export class UpdateNotificationTokensDto extends PartialType(CreateNotificationTokensDto) { }

export class NotificationTokensDto extends BaseListDto {
  @ApiProperty({ nullable: true, required: false })
  userId: number;

  @ApiProperty({ maxLength: 500 })
  token: string;
}