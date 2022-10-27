import { Injectable } from '@nestjs/common';
import { QuantityType, OrderBy, Status, DocumentType, UserType, UserTypeLabel, YesNo, DocumentTypeLabel, StatusLabel, OrderByLabel, YesNoLabel, QuantityTypeLabel, ServiceType, ServiceTypeLabel, TimeType, TimeTypeLabel, ServiceTypeFilter, ServiceTypeFilterLabel, TimeTypeFilterLabel, TimeTypeFilter, RecipeOrderFilter, RecipeOrderFilterLabel, PlaceType, PlaceTypeLabel, YearEnum, MonthEnumLabel, MonthEnum, YearEnumLabel } from 'src/common/enums';

@Injectable()
export class EnumService {
    async list(type: string) {
        var enumValue: any = UserType;
        var enumLabelValue: any = UserTypeLabel;

        switch (type) {
            case 'userType':
                enumValue = UserType;
                enumLabelValue = UserTypeLabel;
                break;
            case 'placeType':
                enumValue = PlaceType;
                enumLabelValue = PlaceTypeLabel;
                break;
            case 'quantityType':
                enumValue = QuantityType;
                enumLabelValue = QuantityTypeLabel;
                break;
            case 'serviceType':
                enumValue = ServiceType;
                enumLabelValue = ServiceTypeLabel;
                break;
            case 'timeType':
                enumValue = TimeType;
                enumLabelValue = TimeTypeLabel;
                break;
            case 'serviceTypeFilter':
                enumValue = ServiceTypeFilter;
                enumLabelValue = ServiceTypeFilterLabel;
                break;
            case 'timeTypeFilter':
                enumValue = TimeTypeFilter;
                enumLabelValue = TimeTypeFilterLabel;
                break;
            case 'recipeOrderFilter':
                enumValue = RecipeOrderFilter;
                enumLabelValue = RecipeOrderFilterLabel;
                break;
            case 'monthEnum':
                enumValue = MonthEnum;
                enumLabelValue = MonthEnumLabel;
                break;
            case 'yearEnum':
                enumValue = YearEnum;
                enumLabelValue = YearEnumLabel;
                break;
            case 'documentType':
                enumValue = DocumentType;
                enumLabelValue = DocumentTypeLabel;
                break;
            case 'status':
                enum StatusCustom {
                    Active = 1,
                    Passive = 2,
                }
                enumValue = StatusCustom
                enumLabelValue = StatusLabel;
                break;
            case 'orderBy':
                enumValue = OrderBy;
                enumLabelValue = OrderByLabel;
                break;
            case 'yesNo':
                enumValue = YesNo;
                enumLabelValue = YesNoLabel;
                break;
            default:
                enumValue = UserType;
                enumLabelValue = UserTypeLabel;
                break;
        }
        var data = [];
        const propertyNames = Object.keys(enumValue);
        propertyNames.forEach((item, key) => {
            if (key < (propertyNames.length / 2)) {
                data.push({ name: enumLabelValue.get(Number(item)), value: item, data: null });
            }
        });
        return {
            data: data,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total: data.length,
            page: 1,
            pageCount: Math.ceil(data.length / 99999)
        };
    }
}
