import { RecipeMaterial } from './recipe-material.entity';
import { RecipeMaterialDto } from './recipe-material.dtos';
import { QuantityTypeLabel } from 'src/common/enums';
import { plainToClass } from 'class-transformer';

export class RecipeMaterialMapper {
  public static ModelToDto(recipeMaterial: RecipeMaterial) {
    var quantityTypeLabel: any = QuantityTypeLabel;
    var recipeMaterialModel = new RecipeMaterialDto();
    Object.keys(plainToClass(RecipeMaterialDto, recipeMaterial)).forEach(value => {
      recipeMaterialModel[value] = recipeMaterial[value];
    });
    recipeMaterialModel.quantityTypeName = quantityTypeLabel.get(Number(recipeMaterial.quantityType));
    return recipeMaterialModel;
  };
};