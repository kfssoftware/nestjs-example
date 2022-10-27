import { User } from './user.entity';
import { UserDto } from './user.dtos';
import { PackageTypeEnumLabel, UserTypeLabel } from 'src/common/enums';
import { plainToClass } from 'class-transformer';

export class UserMapper {
  public static ModelToDto(user: User, follower = 0, followed = 0, recipe = 0, favorites = 0) {
    var enumLabelValue: any = UserTypeLabel;
    var packageEnumLabelValue: any = PackageTypeEnumLabel;
    var userModel = new UserDto();
    Object.keys(plainToClass(UserDto, user)).forEach(value => {
      userModel[value] = user[value]
    });
    userModel.userTypeName = enumLabelValue.get(Number(user.userType))
    userModel.packageTypeName = packageEnumLabelValue.get(Number(user.packageType))
    userModel.follower = follower;
    userModel.followed = followed;
    userModel.recipe = recipe;
    userModel.favorites = favorites;
    return userModel;
  }
}