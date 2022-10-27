import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { ChangeEmailDto, ChangePasswordDto, CreateUserDto, ForgotPasswordDto, MailConfirmDto, MailConfirmSenderDto, MobileUpdateUserDto, NotificationBindingDto, PackageTypeRequestUserDto, PaymentInfoDto, PlaceRequestUserDto, ResetPasswordDto, UpdateNoticeUserDTO, UpdateUserDto, UserDto, UserFilterDto, UserIsFollowFilterDto } from "./user.dtos";
import { ResException } from 'src/common/resException';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { NoticeTypeEnum, NotificationType, Status, StatusLabel, TemplateType, UserType } from 'src/common/enums';
import { MailDto } from '../mail/mail.dtos';
import * as admin from 'firebase-admin';
import { UserMapper } from './user.mapper';
import { UserDocuments } from '../user-documents/user-documents.entity';
import { v4 as uuid } from 'uuid';
import { Language } from '../language/language.entity';
import { Recipe } from '../recipe/recipe.entity';
import { DataTranslate } from '../data-translate/data-translate.entity';
import { InjectExpo } from 'nestjs-expo-sdk';
import { NotificationTokens } from '../notification-tokens/notification-tokens.entity';
import { UserFollow } from '../user-follow/user-follow.entity';
import { RecipeFavorite } from '../recipe-favorite/recipe-favorite.entity';
import { Place } from '../place/place.entity';
import { PackageType } from '../package-type/package-type.entity';
var Iyzipay = require('iyzipay');

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserDto
> {
  constructor(
    public mailService: MailService,
    @InjectRepository(User) public repository: Repository<User>,
    @InjectRepository(UserDocuments) public userDocumentsRepository: Repository<UserDocuments>,
    @InjectRepository(Recipe) public recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeFavorite) public recipeFavoriteRepository: Repository<RecipeFavorite>,
    @InjectRepository(UserFollow) public userFollowRepository: Repository<UserFollow>,
    @InjectRepository(Language) public languageRepository: Repository<Language>,
    @InjectRepository(DataTranslate) public dataTranslateRepository: Repository<DataTranslate>,
    @InjectRepository(NotificationTokens) public notificationTokensRepository: Repository<NotificationTokens>,
    @InjectRepository(Place) public placeRepository: Repository<Place>,
    @InjectRepository(PackageType) public packageTypeRepository: Repository<PackageType>,
    @InjectExpo() private expo: any,
  ) {
    super();
  }

  async _create(createDto: CreateUserDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const emailKey = uuid();
      if (createDto.username == null)
        createDto.username = createDto.email;
      if (createDto.appMailActive == null)
        createDto.appMailActive = false;
      if (createDto.appNotifActive == null)
        createDto.appNotifActive = false;

      createDto.status = Status.Active;

      if (createDto.socialUserId != null)
        createDto.emailConfirm = true;
      else
        createDto.emailKey = emailKey;

      let defaultLanguage = await this.languageRepository.findOne(undefined, {
        where: { isDefault: true },
      });
      if (defaultLanguage)
        createDto.languageId = defaultLanguage.id;

      const userControl = await this.repository.createQueryBuilder('user');
      userControl.select("user.id");
      if (createDto.socialUserId == null)
        userControl.where("user.status = :s0 and (LOWER(user.username) = :s1 OR LOWER(user.email) = :s2)", { s0: Status.Active, s1: `${createDto.username.toLowerCase()}`, s2: `${createDto.email.toLowerCase()}` })
      else
        userControl.where("user.status = :s0 and (LOWER(user.username) = :s1 OR LOWER(user.email) = :s2 OR user.socialUserId = :s3)", { s0: Status.Active, s1: `${createDto.username.toLowerCase()}`, s2: `${createDto.email.toLowerCase()}`, s3: `${createDto.socialUserId}` })

      userControl.getOne();
      const getUserControl = await userControl.getMany();
      if (getUserControl && getUserControl.length > 0) {
        throw new ResException(HttpStatus.FOUND, 'general.user_found');
      }

      const res = await this.repository.insert(createDto);
      const resData = await this.repository.findOne(res.identifiers[0].id);

      const getTranslatesQuery = await this.dataTranslateRepository.createQueryBuilder("user");
      getTranslatesQuery.select();
      getTranslatesQuery.where("user.languageId != :s1 AND user.keyword LIKE :s2", { s1: `${createDto.languageId}`, s2: `mail.%` })
      const getTranslates = await getTranslatesQuery.getMany();
      const key_welcome = getTranslates.find(({ keyword }) => keyword === 'mail.welcome');
      const key_welcome_content = getTranslates.find(({ keyword }) => keyword === 'mail.welcome_content');
      const key_confirm_content = getTranslates.find(({ keyword }) => keyword === 'mail.confirm_content');
      const key_email_confirm = getTranslates.find(({ keyword }) => keyword === 'mail.email_confirm');
      const mailParams = {} as MailDto;
      mailParams.to = createDto.email;
      mailParams.subject = "Patvin - " + (key_welcome ? key_welcome.value : "mail.welcome");
      mailParams.template = TemplateType.Welcome;
      mailParams.username = createDto.username;
      mailParams.logoLink = process.env.WEB_LINK + "/resources/images/logo.png";
      mailParams.link = process.env.WEB_LINK + "/#/auth/email-confirm?key=" + emailKey;
      mailParams.contentText1 = key_welcome ? key_welcome.value : "mail.welcome";
      mailParams.contentText2 = key_welcome_content ? key_welcome_content.value : "mail.welcome_content";
      mailParams.contentText3 = key_confirm_content ? key_confirm_content.value : "mail.confirm_content";
      mailParams.buttonText = key_email_confirm ? key_email_confirm.value : "mail.email_confirm";
      await this.mailService.sendMail(mailParams);

      //admin mail
      // if (createDto.userType != UserType.Admin) {
      //   const getAdminUser = await this.repository.findOne(undefined, { where: { username: "admin" } });
      //   const getTranslatesQuery = await this.dataTranslateRepository.createQueryBuilder("user");
      //   getTranslatesQuery.select();
      //   getTranslatesQuery.where("user.languageId != :s1 AND user.keyword LIKE :s2", { s1: `${getAdminUser.languageId}`, s2: `mail.%` })
      //   const getTranslates = await getTranslatesQuery.getMany();
      //   const key_new_account = getTranslates.find(({ keyword }) => keyword === 'mail.new_account');
      //   const key_fullname = getTranslates.find(({ keyword }) => keyword === 'mail.fullname');
      //   const key_mail = getTranslates.find(({ keyword }) => keyword === 'mail.mail');
      //   const mailParams = {} as MailDto;
      //   mailParams.to = getAdminUser.email;
      //   mailParams.subject = "Patvin - " + (key_new_account ? key_new_account.value : "mail.new_account");
      //   mailParams.template = TemplateType.NewAccount;
      //   mailParams.username = getAdminUser.username;
      //   mailParams.logoLink = process.env.WEB_LINK + "/resources/images/logo.png";
      //   mailParams.contentText1 = key_new_account ? key_new_account.value : "mail.new_account";
      //   mailParams.contentText2 = (key_fullname ? key_fullname.value : "mail.fullname") + ": " + createDto.fullname;
      //   mailParams.contentText3 = (key_mail ? key_mail.value : "mail.mail") + ": " + createDto.email;
      //   await this.mailService.sendMail(mailParams);
      // }
      //admin mail
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async usernameToId(userFilterDto: UserFilterDto) {
    const data = await this.repository.findOne({ where: { username: userFilterDto.username } });
    if (!data) {
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.user_not_found"
      );
    }
    let resData = UserMapper.ModelToDto(data);
    return {
      data: resData,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto): Promise<{ data: boolean, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const resData = await this.repository.findOne(undefined, {
        where: { email: forgotPassword.email, status: Status.Active },
      });
      if (!resData) {
        throw new ResException(
          HttpStatus.NOT_FOUND,
          "general.user_not_found"
        );
      }
      const passwordKey = uuid();
      const getTranslates = await this.dataTranslateRepository.find({ where: { languageId: resData.languageId } });
      const key_reset_password = getTranslates.find(({ keyword }) => keyword === 'mail.reset_password');
      const key_reset_password_content = getTranslates.find(({ keyword }) => keyword === 'mail.reset_password_content');
      await this.repository.update(resData.id, { passwordKey: passwordKey });
      const mailParams = {} as MailDto;
      mailParams.to = forgotPassword.email;
      mailParams.subject = "Patvin - " + (key_reset_password ? key_reset_password.value : "mail.reset_password");
      mailParams.template = TemplateType.ForgotPassword;
      mailParams.username = resData.username;
      mailParams.logoLink = process.env.WEB_LINK + "/resources/images/logo.png";
      if (forgotPassword.isMobile)
        mailParams.link = process.env.WEB_LINK + "/#/auth/redirect-app?key=" + passwordKey;
      else
        mailParams.link = process.env.WEB_LINK + "/#/auth/reset-password?key=" + passwordKey;

      mailParams.contentText1 = key_reset_password ? key_reset_password.value : "mail.reset_password";
      mailParams.contentText2 = key_reset_password_content ? key_reset_password_content.value : "mail.reset_password_content";
      mailParams.buttonText = key_reset_password ? key_reset_password.value : "mail.reset_password";
      await this.mailService.sendMail(mailParams);
      return {
        data: true,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async emailConfirmSender(mailConfirmSenderDto: MailConfirmSenderDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const resData = await this.repository.findOne(undefined, { where: { email: mailConfirmSenderDto.email, status: Status.Active } });
      if (!resData || resData?.emailConfirm == true) {
        throw new ResException(
          HttpStatus.NOT_FOUND,
          "general.user_email_already_confirm"
        );
      }
      else {
        const emailKey = uuid();
        await this.repository.update(resData.id, { emailKey: emailKey })
        const getTranslates = await this.dataTranslateRepository.find({ where: { languageId: resData.languageId } });
        const key_welcome = getTranslates.find(({ keyword }) => keyword === 'mail.welcome');
        const key_welcome_content = getTranslates.find(({ keyword }) => keyword === 'mail.welcome_content');
        const key_confirm_content = getTranslates.find(({ keyword }) => keyword === 'mail.confirm_content');
        const key_email_confirm = getTranslates.find(({ keyword }) => keyword === 'mail.email_confirm');
        const mailParams = {} as MailDto;
        mailParams.to = resData.email;
        mailParams.subject = "Patvin - " + (key_welcome ? key_welcome.value : "mail.welcome");
        mailParams.template = TemplateType.Welcome;
        mailParams.username = resData.username;
        mailParams.logoLink = process.env.WEB_LINK + "/resources/images/logo.png";
        mailParams.link = process.env.WEB_LINK + "/#/auth/email-confirm?key=" + emailKey;
        mailParams.contentText1 = key_welcome ? key_welcome.value : "mail.welcome";
        mailParams.contentText2 = key_welcome_content ? key_welcome_content.value : "mail.welcome_content";
        mailParams.contentText3 = key_confirm_content ? key_confirm_content.value : "mail.confirm_content";
        mailParams.buttonText = key_email_confirm ? key_email_confirm.value : "mail.email_confirm";
        await this.mailService.sendMail(mailParams);
      }
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async emailConfirmUser(mailConfirmDto: MailConfirmDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const resData = await this.repository.findOne(undefined, { where: { emailKey: mailConfirmDto.emailKey, status: Status.Active } });
      if (!resData)
        throw new ResException(
          HttpStatus.NOT_FOUND,
          "general.user_not_found"
        );
      if (resData.emailConfirm)
        throw new ResException(
          HttpStatus.NOT_FOUND,
          "general.user_email_already_confirm"
        );

      await this.repository.update(resData.id, { emailConfirm: true, emailKey: null });
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async confirmUser(id: number): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      await this.repository.update(id, { confirm: true });
      const resData = await this.repository.findOne(id);
      //notification start
      if (resData) {
        const getAssociatedUsers = await this.repository.find({ where: { email: resData.email, status: Status.Active }, relations: ['notificationTokens'] });
        const getTranslates = await this.dataTranslateRepository.find({ where: { languageId: resData.languageId } });
        const key_account_verification = getTranslates.find(({ keyword }) => keyword === 'mail.account_verification');
        const key_account_verification_content = getTranslates.find(({ keyword }) => keyword === 'mail.account_verification_content');
        let messages = [];
        if (getAssociatedUsers && getAssociatedUsers.length > 0) {
          await Promise.all(
            getAssociatedUsers.map(async (userItem: User) => {
              if (userItem.notificationTokens) {
                await Promise.all(userItem.notificationTokens.map(async (item: NotificationTokens) => {
                  messages.push({
                    to: item.token,
                    sound: 'default',
                    title: key_account_verification ? key_account_verification.value : "mail.account_verification",
                    body: key_account_verification_content ? key_account_verification_content.value : "mail.account_verification_content",
                    data: { notificationType: NotificationType.NoAction },
                  });
                }));
              }
            }));

          let chunks = this.expo.chunkPushNotifications(messages);
          let tickets = [];

          for (let chunk of chunks) {
            try {
              let ticketChunk = await this.expo.sendPushNotificationsAsync(messages);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      //notification end
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async updateNotice(user: User, updateNoticeUserDTO: UpdateNoticeUserDTO): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      let resData = await this.repository.findOne(user.id);
      let getOtherUser = null;
      if (updateNoticeUserDTO.noticeType === NoticeTypeEnum.AppEmail) {
        await this.repository.update(user.id, { appMailActive: updateNoticeUserDTO.status });
        if (getOtherUser)
          await this.repository.update(getOtherUser.id, { appMailActive: updateNoticeUserDTO.status });
      }
      else if (updateNoticeUserDTO.noticeType === NoticeTypeEnum.AppMobile) {
        await this.repository.update(user.id, { appNotifActive: updateNoticeUserDTO.status });
        if (getOtherUser)
          await this.repository.update(getOtherUser.id, { appNotifActive: updateNoticeUserDTO.status });
      }

      resData = await this.repository.findOne(user.id);
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async updateStatus(id: number, status: number): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      let resData = await this.repository.findOne(id);
      await this.repository.update(id, { status: status });
      resData = await this.repository.findOne(id);
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async mobileUpdate(user: User, updateUserDto: MobileUpdateUserDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      let resData = await this.repository.findOne(user.id);
      await this.repository.update(user.id, updateUserDto);
      resData = await this.repository.findOne(user.id);
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async packageType(user: User, packageTypeRequestUserDto: PackageTypeRequestUserDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      let resData = await this.repository.findOne(user.id);
      let getPackageType = await this.packageTypeRepository.findOne(packageTypeRequestUserDto.packageId);
      let paymentInfo = new PaymentInfoDto({
        cardHolderName: packageTypeRequestUserDto.cardHolderName,
        cardNumber: packageTypeRequestUserDto.cardNumber,
        expireMonth: packageTypeRequestUserDto.expireMonth,
        expireYear: packageTypeRequestUserDto.expireYear,
        cvc: packageTypeRequestUserDto.cvc,
        registerCard: packageTypeRequestUserDto.registerCard,
      });
      let basketItems = [];
      basketItems.push({
        id: "CHEF-" + getPackageType?.id.toString(),
        name: getPackageType?.name,
        category1: 'Ürün',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: getPackageType?.price.toString()
      });

      const paymentOperation = await this.payment(user, getPackageType?.price, paymentInfo, basketItems);
      if (paymentOperation && paymentOperation?.status == "success") {
        await this.repository.update(user?.id, { packageType: getPackageType?.packageType });
      }
      else {
        throw new ResException(
          HttpStatus.BAD_REQUEST,
          paymentOperation?.errorMessage
        );
      }
      if (!resData) {
        throw new ResException(
          HttpStatus.NOT_FOUND,
          "general.user_not_found"
        );
      }
      resData = await this.repository.findOne(user.id);
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async placeTypeUpdate(user: User, placeRequestUserDto: PlaceRequestUserDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      let resData = await this.repository.findOne(user.id);
      if (!resData) {
        throw new ResException(
          HttpStatus.NOT_FOUND,
          "general.user_not_found"
        );
      }
      await this.repository.update(user.id, {
        userType: UserType.Place,
        profilePhoto: placeRequestUserDto.profilePhoto,
        phone: placeRequestUserDto.phone,
        username: placeRequestUserDto.username,
        fullname: placeRequestUserDto.fullname,
        description: placeRequestUserDto.description,
        email: placeRequestUserDto.email
      });
      await this.placeRepository.create({
        facebookUrl: placeRequestUserDto.facebookUrl,
        instagramUrl: placeRequestUserDto.instagramUrl,
        twitterUrl: placeRequestUserDto.twitterUrl,
        youtubeUrl: placeRequestUserDto.youtubeUrl,
        latitude: placeRequestUserDto.latitude,
        longitude: placeRequestUserDto.longitude,
        userId: user?.id,
        webSiteUrl: placeRequestUserDto.webSiteUrl
      });
      resData = await this.repository.findOne(user.id);
      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ data: boolean, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const resData = await this.repository.findOne(undefined, { where: { passwordKey: resetPasswordDto.passwordKey } });
      await this.repository.update(resData.id, { password: resetPasswordDto.password, passwordKey: null });
      return {
        data: true,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async changeMail(user: User, changeEmailDto: ChangeEmailDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      const emailKey = uuid();
      let resData = await this.repository.findOne(user.id);
      await this.repository.update(user.id, { email: changeEmailDto.email, emailConfirm: false, emailKey: emailKey });
      resData = await this.repository.findOne(user.id);
      //mail
      const getTranslates = await this.dataTranslateRepository.find({ where: { languageId: resData.languageId } });
      const key_welcome = getTranslates.find(({ keyword }) => keyword === 'mail.welcome');
      const key_welcome_content = getTranslates.find(({ keyword }) => keyword === 'mail.welcome_content');
      const key_confirm_content = getTranslates.find(({ keyword }) => keyword === 'mail.confirm_content');
      const key_email_confirm = getTranslates.find(({ keyword }) => keyword === 'mail.email_confirm');
      const mailParams = {} as MailDto;
      mailParams.to = changeEmailDto.email;
      mailParams.subject = "Patvin - " + (key_welcome ? key_welcome.value : "mail.welcome");
      mailParams.template = TemplateType.Welcome;
      mailParams.username = resData.username;
      mailParams.logoLink = process.env.WEB_LINK + "/resources/images/logo.png";
      mailParams.link = process.env.WEB_LINK + "/#/auth/email-confirm?key=" + emailKey;
      mailParams.contentText1 = key_welcome ? key_welcome.value : "mail.welcome";
      mailParams.contentText2 = key_welcome_content ? key_welcome_content.value : "mail.welcome_content";
      mailParams.contentText3 = key_confirm_content ? key_confirm_content.value : "mail.confirm_content";
      mailParams.buttonText = key_email_confirm ? key_email_confirm.value : "mail.email_confirm";
      await this.mailService.sendMail(mailParams);
      //mail

      return {
        data: resData as User,
        status: 1,
        errorMessage: null,
        errorMessageTechnical: null,
        meta: null,
      };
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{ data: User, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
    try {
      if (changePasswordDto.id) {
        const resData = await this.repository.findOne(changePasswordDto.id);
        if (!resData) {
          throw new ResException(
            HttpStatus.NOT_FOUND,
            "general.user_not_found"
          );
        }
        const passwordOk = bcrypt.compareSync(changePasswordDto.password, resData.password);
        if (passwordOk)
          throw new ResException(
            HttpStatus.NOT_FOUND,
            "message.current_password_must_not_be_same_as_new_password"
          );
        await this.repository.update(changePasswordDto.id, { password: changePasswordDto.password });
        return {
          data: resData as User,
          status: 1,
          errorMessage: null,
          errorMessageTechnical: null,
          meta: null,
        };
      }
      else {
        const resData = await this.repository.findOne(user.id);
        const passwordOk = bcrypt.compareSync(changePasswordDto.password, resData.password);
        if (!passwordOk) {
          throw new ResException(
            HttpStatus.NOT_FOUND,
            "general.user_not_found"
          );
        }
        await this.repository.update(user.id, { password: changePasswordDto.newPassword });
        return {
          data: resData as User,
          status: 1,
          errorMessage: null,
          errorMessageTechnical: null,
          meta: null,
        };
      }
    } catch (error) {
      console.log(error);
      throw new ResException(
        HttpStatus.BAD_REQUEST,
        error?.response?.exceptionMessage ? error.response.exceptionMessage : error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
      );
    }
  }

  async _list(alias: string, userFilterDto: UserFilterDto) {
    const builder = await this.repository.createQueryBuilder(alias);
    if (userFilterDto.id)
      builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${userFilterDto.id}`, status: Status.Deleted })
    else {
      if (userFilterDto.status)
        builder.where(alias + ".status = :s", { s: `${userFilterDto.status}` })
      else
        builder.where(alias + ".status != :s", { s: `${Status.Deleted}` })

      if (userFilterDto.search)
        builder.where("LOWER(" + alias + ".name) LIKE :s OR LOWER(" + alias + ".username) LIKE :s OR LOWER(" + alias + ".email) LIKE :s", { s: `%${userFilterDto.search.toLowerCase()}%` })

      if (userFilterDto.userType) {
        if (userFilterDto.status)
          builder.where(alias + ".userType = :s and " + alias + ".status = :status", { s: `${userFilterDto.userType}`, status: `${userFilterDto.status}` })
        else
          builder.where(alias + ".userType = :s and " + alias + ".status != :status", { s: `${userFilterDto.userType}`, status: `${Status.Deleted}` })
      }
      if (userFilterDto.fullname)
        builder.where("LOWER(" + alias + ".fullname) LIKE :s", { s: `%${userFilterDto.fullname.toLowerCase()}%` })

      if (userFilterDto.email)
        builder.where("LOWER(" + alias + ".email) LIKE :s", { s: `%${userFilterDto.email.toLowerCase()}%` })

      if (userFilterDto.phone)
        builder.where(alias + ".phone LIKE :s", { s: `%${userFilterDto.phone}%` })
    }

    builder.relation("role");
    builder.relation("language");

    builder.leftJoinAndSelect(alias + ".role", "role")
    builder.leftJoinAndSelect(alias + ".language", "language")

    const sort: any = userFilterDto.sortby;

    if (sort)
      builder.orderBy(alias + '.id', sort.order.toUpperCase());
    else
      builder.orderBy(alias + '.id', "DESC");

    const page: number = parseInt(userFilterDto.page as any) || 1;
    const perPage: number = parseInt(userFilterDto.limit as any) || 10;
    const total = await builder.getCount();
    builder.offset((page - 1) * perPage).limit(perPage);

    const data = await builder.getMany();
    const responseData = [];
    data.forEach(item => {
      responseData.push(UserMapper.ModelToDto(item));
    });

    return {
      data: responseData,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      total,
      page,
      pageCount: Math.ceil(total / perPage)
    };
  }

  async generalList(alias: string, userFilterDto: UserFilterDto) {
    const builder = await this.repository.createQueryBuilder(alias);
    if (userFilterDto.id)
      builder.where(alias + ".id = :id AND " + alias + ".status = :status", { id: `${userFilterDto.id}`, status: Status.Active })
    else {
      if (userFilterDto.search)
        builder.where("(LOWER(" + alias + ".fullname) LIKE :s OR LOWER(" + alias + ".username) LIKE :s) AND " + alias + ".userType != :userType and " + alias + ".status = :status", { s: `%${userFilterDto.search.toLowerCase()}%`, userType: UserType.Admin, status: `${Status.Active}` })
      else
        builder.where(alias + ".userType != :userType and " + alias + ".status = :status", { userType: UserType.Admin, status: `${Status.Active}` })
    }
    builder.select(["user.id", "user.username", "user.fullname", "user.description", "user.email", "user.languageId", "user.profilePhoto", "user.point", "user.userType"]);
    const sort: any = userFilterDto.sortby;
    if (sort)
      builder.orderBy(alias + '.id', sort.order.toUpperCase());
    else
      builder.orderBy(alias + '.id', "DESC");

    const page: number = parseInt(userFilterDto.page as any) || 1;
    const perPage: number = parseInt(userFilterDto.limit as any) || 10;
    const total = await builder.getCount();
    builder.offset((page - 1) * perPage).limit(perPage);

    const data = await builder.getMany();
    const responseData = [];
    data.forEach(item => {
      responseData.push(UserMapper.ModelToDto(item));
    });

    return {
      data: responseData,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      total,
      page,
      pageCount: Math.ceil(total / perPage)
    };
  }

  async myProfile(user: User) {
    let data = await this.repository.findOne(user.id, { relations: ['role', 'language', 'userDocuments'] }) as any;
    const followed = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.userId = :userId', {
        userId: user.id
      })
      .getRawOne();
    const follower = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.otherUserId = :userId', {
        userId: user.id
      })
      .getRawOne();
    const recipe = await this.recipeRepository.createQueryBuilder("recipe")
      .select("COUNT(recipe.id)", "total")
      .where('recipe.userId = :userId', {
        userId: user.id
      })
      .getRawOne();
    const recipeFavorite = await this.recipeFavoriteRepository.createQueryBuilder("recipe_favorite")
      .select("COUNT(recipe_favorite.id)", "total")
      .where('recipe_favorite.userId = :userId', {
        userId: user.id
      })
      .getRawOne();
    return {
      data: UserMapper.ModelToDto(data, follower.total, followed.total, recipe.total, recipeFavorite.total),
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async profile(userFilterDto: UserFilterDto) {
    let data = await this.repository.findOne(userFilterDto.id, { relations: ['role', 'language', 'userDocuments'] }) as any;
    const followed = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.userId = :userId', {
        userId: userFilterDto.id
      })
      .getRawOne();
    const follower = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.otherUserId = :userId', {
        userId: userFilterDto.id
      })
      .getRawOne();
    const recipe = await this.recipeRepository.createQueryBuilder("recipe")
      .select("COUNT(recipe.id)", "total")
      .where('recipe.userId = :userId', {
        userId: userFilterDto.id
      })
      .getRawOne();
    const recipeFavorite = await this.recipeFavoriteRepository.createQueryBuilder("recipe_favorite")
      .select("COUNT(recipe_favorite.id)", "total")
      .where('recipe_favorite.userId = :userId', {
        userId: userFilterDto.id
      })
      .getRawOne();
    return {
      data: UserMapper.ModelToDto(data, follower.total, followed.total, recipe.total, recipeFavorite.total),
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async isFollow(user: User, userIsFollowFilterDto: UserIsFollowFilterDto) {
    let data = await this.userFollowRepository.count({ where: { userId: user.id, otherUserId: userIsFollowFilterDto.userId } });
    return {
      data: data > 0 ? true : false,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async _detail(id: number) {
    let data = await this.repository.findOne(id, { relations: ['role', 'language', 'userDocuments'] }) as any;
    const followed = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.userId = :userId', {
        userId: id
      })
      .getRawOne();
    const follower = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.otherUserId = :userId', {
        userId: id
      })
      .getRawOne();
    const recipe = await this.recipeRepository.createQueryBuilder("recipe")
      .select("COUNT(recipe.id)", "total")
      .where('recipe.userId = :userId', {
        userId: id
      })
      .getRawOne();
    const recipeFavorite = await this.recipeFavoriteRepository.createQueryBuilder("recipe_favorite")
      .select("COUNT(recipe_favorite.id)", "total")
      .where('recipe_favorite.userId = :userId', {
        userId: id
      })
      .getRawOne();
    return {
      data: UserMapper.ModelToDto(data, follower.total, followed.total, recipe.total, recipeFavorite.total),
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async detailLogin(username: string) {
    const userControl = await this.repository.createQueryBuilder('user');
    userControl.where("user.status = :s0 and (LOWER(user.username) = :s1 OR LOWER(user.email) = :s2)", { s0: Status.Active, s1: `${username.toLowerCase()}`, s2: `${username.toLowerCase()}` })
    userControl.relation("role");
    userControl.relation("language");
    userControl.leftJoinAndSelect("user.role", "role")
    userControl.leftJoinAndSelect("user.language", "language")
    userControl.getOne();
    const dataRow = await userControl.getMany();
    const followed = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.userId = :userId', {
        userId: dataRow[0].id
      })
      .getRawOne();
    const follower = await this.userFollowRepository.createQueryBuilder("user_follow")
      .select("COUNT(user_follow.id)", "total")
      .where('user_follow.otherUserId = :userId', {
        userId: dataRow[0].id
      })
      .getRawOne();
    const recipe = await this.recipeRepository.createQueryBuilder("recipe")
      .select("COUNT(recipe.id)", "total")
      .where('recipe.userId = :userId', {
        userId: dataRow[0].id
      })
      .getRawOne();
    const recipeFavorite = await this.recipeFavoriteRepository.createQueryBuilder("recipe_favorite")
      .select("COUNT(recipe_favorite.id)", "total")
      .where('recipe_favorite.userId = :userId', {
        userId: dataRow[0].id
      })
      .getRawOne();
    const data = UserMapper.ModelToDto(dataRow[0], follower.total, followed.total, recipe.total, recipeFavorite.total);
    if (!data)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.user_not_found"
      );
    data.password = dataRow[0].password;
    this.repository.update(data?.id, { updatedDate: new Date() });
    return data;
  }

  async detailSocialLogin(socialUserId: string) {
    const userControl = await this.repository.createQueryBuilder('user');
    userControl.where("user.status = :s0 and LOWER(user.socialUserId) = :s1", { s0: Status.Active, s1: `${socialUserId.toLowerCase()}` })
    userControl.relation("role");
    userControl.relation("language");
    userControl.leftJoinAndSelect("user.role", "role")
    userControl.leftJoinAndSelect("user.language", "language")
    userControl.getOne();
    const data = await userControl.getMany();
    if (data && data.length <= 0)
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.user_not_found"
      );
    this.repository.update(data[0]?.id, { updatedDate: new Date() });
    return data[0];
  }

  async accountDeleteUser(user: User) {
    const getUsers = await this.repository.find({ where: { email: user.email } });
    await Promise.all(
      getUsers.map(async (userItem: User) => {
        await this.repository.update(userItem.id, { status: Status.Deleted })
      }));
    return {
      data: true,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async deleteUser(userId: number) {
    await this.notificationTokensRepository.delete({ userId: userId });
    await this.repository.update(userId, { status: Status.Deleted })
    return {
      data: true,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null
    };
  }

  async payment(user: User, price: number, paymentInfo: PaymentInfoDto, basketItems: Array<any>): Promise<any> {
    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZIPAY_API_KEY,
      secretKey: process.env.IYZIPAY_SECRET_KEY,
      uri: process.env.IYZIPAY_URI
    });
    var iyziPayRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: price.toString(),
      paidPrice: price.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: 'B67832',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
      paymentCard: {
        cardHolderName: paymentInfo.cardHolderName.toString(),
        cardNumber: paymentInfo.cardNumber.toString(),
        expireMonth: paymentInfo.expireMonth.toString(),
        expireYear: paymentInfo.expireYear.toString(),
        cvc: paymentInfo.cvc.toString(),
        registerCard: paymentInfo.registerCard ? '1' : '0',
      },
      buyer: {
        id: user?.id.toString(),
        name: user?.fullname,
        surname: user?.username,
        gsmNumber: user?.phone,
        email: user?.email,
        identityNumber: '11111111111',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: user?.fullname,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: user?.fullname,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      basketItems: basketItems
    };
    return new Promise(function (resolve, reject) {
      iyzipay.payment.create(iyziPayRequest, function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}