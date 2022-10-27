import { ApiProperty } from '@nestjs/swagger';

export class BaseListDto {

  @ApiProperty() id: number;

  @ApiProperty() createdDate!: Date;

  @ApiProperty() updatedDate!: Date;

  @ApiProperty() createdUserId: number;

  @ApiProperty() updatedUserId: number;

  @ApiProperty() status: number;
}