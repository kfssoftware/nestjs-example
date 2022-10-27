import { UserTypeLabel } from 'src/common/enums';
import { plainToClass } from 'class-transformer';
import { Role } from './role.entity';
import { RoleDto } from './role.dtos';

export class RoleMapper {
  public static ModelToDto(role: Role) {
    var userTypeLabel: any = UserTypeLabel;
    var roleModel = new RoleDto();
    Object.keys(plainToClass(RoleDto, role)).forEach(value => {
      roleModel[value] = role[value]
    });
    roleModel.userTypeName = userTypeLabel.get(Number(role.userType))
    return roleModel;
  };
};