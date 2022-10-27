import { ApiProperty } from '@nestjs/swagger';
import { UserType, DocumentType, QuantityType } from 'src/common/enums';
import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';
import { BaseFilterDto } from '../base/base.filter.dto';

export class CreateRecipeMaterialDto {

  @ApiProperty() recipeId: number;

  @ApiProperty() materialId: number;

  @ApiProperty() quantity: number;

  @ApiProperty() aim: string;

  @ApiProperty() quantityType: QuantityType;

  @ApiProperty() optional: Boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateRecipeMaterialDto extends PartialType(CreateRecipeMaterialDto) { }

export class RecipeMaterialFilterDto extends BaseFilterDto {
  @ApiProperty() recipeId: number;
}

export class RecipeMaterialDto extends BaseListDto {
  @ApiProperty()
  recipeId: number;

  @ApiProperty() materialId: number;

  @ApiProperty() quantity: number;

  @ApiProperty() optional: Boolean;

  @ApiProperty({
    type: 'enum',
    enum: QuantityType,
    default: QuantityType.Gram
  })
  public quantityType: QuantityType

  @ApiProperty()
  quantityTypeName: string;

  @ApiProperty()
  aim: string;
}