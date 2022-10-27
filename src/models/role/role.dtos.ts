import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/common/enums';
import { BaseFilterDto } from '../base/base.filter.dto';
import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';

export class CreateRoleDto {
  @ApiProperty() name: string;

  @ApiProperty() actions: number[];

  @ApiProperty() userType: UserType;

  constructor(object: any) {
    Object.assign(this, object);
  }
}


export class RoleFilterDto extends BaseFilterDto {
  @ApiProperty() userType: UserType;

  @ApiProperty() name: string;
}


export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class RoleDto extends BaseListDto {
  @ApiProperty({ maxLength: 30 })
  name: string;

  @ApiProperty()
  actions: number[];

  @ApiProperty({
    type: 'enum',
    enum: UserType,
    default: UserType.Admin
  })
  public userType: UserType

  userTypeName: string;
}