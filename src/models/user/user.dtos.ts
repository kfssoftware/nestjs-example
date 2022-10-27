import { ApiProperty } from '@nestjs/swagger';
import { UserType, Status, YesNo, PlaceType, PackageTypeEnum } from 'src/common/enums';
import { NoticeTypeEnum } from 'src/common/enums';
import { BaseFilterDto } from '../base/base.filter.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDto } from '../role/role.dtos';
import { LanguageDto } from '../language/language.dtos';
import { BaseListDto } from '../base/base.list.dto';

export class CreateUserDto {
  @ApiProperty({ maxLength: 100 })
  fullname: string;

  @ApiProperty({ nullable: true, maxLength: 50 })
  username: string;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty({ nullable: true })
  profilePhoto: string;

  @ApiProperty({ nullable: true })
  video: string;

  @ApiProperty({ maxLength: 64, nullable: true, required: false })
  password: string;

  @ApiProperty({ maxLength: 100, nullable: true, required: false })
  socialUserId: string;

  @ApiProperty({ default: UserType.User }) userType: UserType

  @ApiProperty({ default: PackageTypeEnum.Basic }) packageType: PackageTypeEnum

  @ApiProperty() placeType: PlaceType

  @ApiProperty({ nullable: true, required: false })
  roleId: number;

  @ApiProperty({ maxLength: 50 })
  email: string;

  @ApiProperty({ nullable: true })
  emailConfirm: Boolean;

  @ApiProperty({ maxLength: 100, nullable: true, required: false })
  emailKey: string;

  @ApiProperty({ maxLength: 20, nullable: true })
  phone: string;

  @ApiProperty({ nullable: true })
  appNotifActive: Boolean;

  @ApiProperty({ nullable: true })
  appMailActive: Boolean;

  @ApiProperty({ nullable: true })
  isMobile: Boolean;

  @ApiProperty({ nullable: true }) languageId: number;

  @ApiProperty({ nullable: true }) status: Status;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class ForgotPasswordDto {
  @ApiProperty({ maxLength: 50 })
  email: string;

  @ApiProperty({ nullable: true })
  isMobile: Boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class MailConfirmSenderDto {
  @ApiProperty({ maxLength: 100 })
  email: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class MailConfirmDto {
  @ApiProperty({ maxLength: 50 })
  emailKey: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateNoticeUserDTO {
  @ApiProperty()
  noticeType: NoticeTypeEnum;

  @ApiProperty()
  status: boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class ChangePasswordDto {
  @ApiProperty()
  id?: number | null;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  newPassword?: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class ChangeEmailDto {

  @ApiProperty()
  email?: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class ResetPasswordDto {
  @ApiProperty()
  passwordKey: string;

  @ApiProperty()
  password: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateUserDto {
  @ApiProperty({ maxLength: 100 })
  fullname?: string;

  @ApiProperty({ nullable: true, maxLength: 50 })
  username?: string;

  @ApiProperty({ maxLength: 64 })
  password?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty() userType?: UserType

  @ApiProperty() packageType?: PackageTypeEnum

  @ApiProperty({ nullable: true })
  roleId?: number;

  @ApiProperty({ maxLength: 50 })
  email?: string;

  @ApiProperty({ maxLength: 20, nullable: true })
  phone?: string;

  @ApiProperty({ nullable: true })
  appNotifActive?: Boolean;

  @ApiProperty({ nullable: true })
  appMailActive?: Boolean;

  @ApiProperty({ nullable: true }) languageId?: number;

  @ApiProperty({ nullable: true }) status?: Status;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class MobileUpdateUserDto {
  @ApiProperty({ maxLength: 100 })
  fullname?: string;

  @ApiProperty({ nullable: true, maxLength: 50 })
  username?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ maxLength: 50 })
  email?: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class PlaceRequestUserDto {
  @ApiProperty() placeType?: PlaceType

  @ApiProperty({ type: 'text', nullable: true })
  profilePhoto: string;

  @ApiProperty({ maxLength: 100 })
  fullname?: string;

  @ApiProperty({ nullable: true, maxLength: 50 })
  username?: string;

  @ApiProperty({ maxLength: 50 })
  email?: string;

  @ApiProperty({ maxLength: 20, nullable: true })
  phone?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  webSiteUrl?: string;

  @ApiProperty({ nullable: true })
  facebookUrl?: string;

  @ApiProperty({ nullable: true })
  twitterUrl?: string;

  @ApiProperty({ nullable: true })
  instagramUrl?: string;

  @ApiProperty({ nullable: true })
  youtubeUrl?: string;

  @ApiProperty({ type: "float", nullable: true })
  latitude: number

  @ApiProperty({ type: "float", nullable: true })
  longitude: number;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class PaymentInfoDto {
  @ApiProperty({ type: 'text', nullable: true })
  cardHolderName: string;

  @ApiProperty({ type: 'text', nullable: true })
  cardNumber: string;

  @ApiProperty({ type: 'text', nullable: true })
  expireMonth: string;

  @ApiProperty({ type: 'text', nullable: true })
  expireYear: string;

  @ApiProperty({ type: 'text', nullable: true })
  cvc: string;

  @ApiProperty({ default: false })
  registerCard: boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class PackageTypeRequestUserDto {
  @ApiProperty() userId: number

  @ApiProperty() packageId: number

  @ApiProperty({ type: 'text', nullable: true })
  cardHolderName: string;

  @ApiProperty({ type: 'text', nullable: true })
  cardNumber: string;

  @ApiProperty({ type: 'text', nullable: true })
  expireMonth: string;

  @ApiProperty({ type: 'text', nullable: true })
  expireYear: string;

  @ApiProperty({ type: 'text', nullable: true })
  cvc: string;

  @ApiProperty({ default: false })
  registerCard: boolean;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class NotificationBindingDto {

  @ApiProperty({ nullable: true, required: false })
  userId: number | null;

  @ApiProperty()
  token?: string;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UserFilterDto extends BaseFilterDto {
  @ApiProperty() userType: UserType;

  @ApiProperty() packageType: PackageTypeEnum

  @ApiProperty() fullname: string;

  @ApiProperty() username: string;

  @ApiProperty() email: string;

  @ApiProperty() phone: string;
}

export class UserIsFollowFilterDto extends BaseFilterDto {
  @ApiProperty() userId: number;

}
export class Test { userTypeName: string };

export class UserDto extends BaseListDto {
  @ApiProperty({ type: 'varchar', maxLength: 100 })
  fullname: string;

  @ApiProperty({ type: 'varchar', maxLength: 50, nullable: true })
  username: string;

  @ApiProperty({ nullable: true })
  description: string;

  @Exclude()
  password: string;

  @Exclude()
  passwordKey: string;

  @Exclude()
  notificationTopic: string;

  @ApiProperty({
    type: 'enum',
    enum: UserType,
    default: UserType.Admin
  })
  public userType: UserType

  @ApiProperty({
    type: 'enum',
    enum: PackageTypeEnum,
    default: PackageTypeEnum.Basic
  })
  public packageType: PackageTypeEnum

  @ApiProperty() placeType: PlaceType

  @ApiProperty({ nullable: true })
  roleId: number;

  @ApiProperty({ type: 'varchar', maxLength: 50 })
  email: string;

  @ApiProperty({ type: 'varchar', maxLength: 20, nullable: true })
  phone: string;

  @ApiProperty({ nullable: true })
  birthDate: Date;

  @ApiProperty({ nullable: true })
  appNotifActive: Boolean;

  @ApiProperty({ nullable: true })
  appMailActive: Boolean;

  @ApiProperty({ nullable: true })
  languageId: number;

  @ApiProperty({ nullable: true })
  follower: number;

  @ApiProperty({ nullable: true })
  followed: number;

  @ApiProperty({ nullable: true })
  recipe: number;

  @ApiProperty({ nullable: true })
  favorites: number;

  @ApiProperty({ nullable: true })
  point: number;

  @ApiProperty({ default: 0 })
  rateCount: number;

  @ApiProperty({ default: 0 })
  rateSum: number;

  @ApiProperty({ type: 'double precision', default: 0 })
  rateAvg: number;

  @ApiProperty() rated: boolean;

  @ApiProperty({ type: 'text', nullable: true })
  profilePhoto: string;

  @ApiProperty({ type: 'text', nullable: true })
  video: string;

  @ApiProperty({ nullable: true })
  confirm: Boolean;

  @ApiProperty({ nullable: true })
  emailConfirm: Boolean;

  @ApiProperty()
  userTypeName: string;

  @ApiProperty()
  packageTypeName: string;

  @ApiProperty()
  role: RoleDto;

  @ApiProperty()
  language: LanguageDto;
}

