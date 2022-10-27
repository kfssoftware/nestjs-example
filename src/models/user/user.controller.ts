import { Controller, Get, Post, Body, Param, Delete, Req, Put, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleActions } from 'src/common/roles.decorator';
import { RoleActionEnum } from 'src/common/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, MailConfirmSenderDto, UpdateNoticeUserDTO, UpdateUserDto, UserFilterDto, ForgotPasswordDto, ChangePasswordDto, ResetPasswordDto, MailConfirmDto, NotificationBindingDto, ChangeEmailDto, UserIsFollowFilterDto, PlaceRequestUserDto, PackageTypeRequestUserDto } from "./user.dtos";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserCreate)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService._create(createUserDto);
  }

  @Post('usernameToId')
  usernameToId(@Body() userFilterDto: UserFilterDto) {
    return this.userService.usernameToId(userFilterDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserList)
  async list(@Body() userFilterDto: UserFilterDto) {
    const data = await this.userService._list('user', userFilterDto);
    return data;
  }

  @Post('generalList')
  async generalList(@Body() userFilterDto: UserFilterDto) {
    const data = await this.userService.generalList('user', userFilterDto);
    return data;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  detail(@Param('id') id: string) {
    return this.userService._detail(+id);
  }

  @Post('myProfile')
  @UseGuards(JwtAuthGuard)
  myProfile(@Request() req: any) {
    return this.userService.myProfile(req.user);
  }

  @Post('profile')
  profile(@Body() userFilterDto: UserFilterDto) {
    return this.userService.profile(userFilterDto);
  }

  @Post('isFollow')
  @UseGuards(JwtAuthGuard)
  isFollow(@Request() req: any, @Body() userIsFollowFilterDto: UserIsFollowFilterDto) {
    return this.userService.isFollow(req.user, userIsFollowFilterDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Put('mobile/update')
  @UseGuards(JwtAuthGuard)
  mobileUpdate(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.mobileUpdate(req.user, updateUserDto);
  }

  @Put('placeType/update')
  @UseGuards(JwtAuthGuard)
  placeTypeUpdate(@Request() req: any, @Body() placeRequestUserDto: PlaceRequestUserDto) {
    return this.userService.placeTypeUpdate(req.user, placeRequestUserDto);
  }

  @Put('packageType/update')
  @UseGuards(JwtAuthGuard)
  packageType(@Request() req: any, @Body() packageTypeRequestUserDto: PackageTypeRequestUserDto) {
    return this.userService.packageType(req.user, packageTypeRequestUserDto);
  }

  @Post('changeLanguage/:id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserUpdate)
  changeLanguage(@Request() req: any, @Param('id') id: string) {
    return this.userService.update(req.user.id, { languageId: +id });
  }

  @Post('dropdown')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserList)
  dropdown() {
    return this.userService.dropdown();
  }

  @Put('confirm/:id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserUpdate)
  confirmUser(@Param('id') id: string) {
    return this.userService.confirmUser(+id);
  }

  @Post('email/confirm')
  emailConfirmUser(@Body() mailConfirmDto: MailConfirmDto) {
    return this.userService.emailConfirmUser(mailConfirmDto);
  }

  @Post('email/confirmSender')
  emailConfirmSender(@Body() mailConfirmSenderDto: MailConfirmSenderDto) {
    return this.userService.emailConfirmSender(mailConfirmSenderDto);
  }

  @Post('forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserUpdate)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.userService.updateStatus(+id, status);
  }

  @Put('update/changePassword')
  @UseGuards(JwtAuthGuard)
  changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user, changePasswordDto);
  }

  @Put('update/email')
  @UseGuards(JwtAuthGuard)
  changeMail(@Request() req: any, @Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.changeMail(req.user, changeEmailDto);
  }

  @Put('update/notice')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserUpdate)
  updateNotice(@Request() req: any, @Body() updateNoticeUserDTO: UpdateNoticeUserDTO) {
    return this.userService.updateNotice(req.user, updateNoticeUserDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserDelete)
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  @Post('account/delete')
  @UseGuards(JwtAuthGuard)
  accountDelete(@Request() req: any,) {
    return this.userService.accountDeleteUser(req.user);
  }
}
