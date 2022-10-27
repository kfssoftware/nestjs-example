import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums';

export class BaseFilterDto {

  @ApiProperty() id: number;

  @ApiProperty() page: number;

  @ApiProperty() limit: number;

  @ApiProperty() search: string;

  @ApiProperty() sortby: object;

  @ApiProperty({
    type: 'enum',
    enum: Status,
    default: Status.Active
  })
  public status: Status;

  constructor(object: any) {
    Object.assign(this, object);
  }
}