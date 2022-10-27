import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserSubscriber } from './user.entity';
import { RolesGuard } from 'src/common/roles.guard';
import { MailModule } from '../mail/mail.module';
import { UserDocuments } from '../user-documents/user-documents.entity';
import { Language } from '../language/language.entity';
import { DataTranslate } from '../data-translate/data-translate.entity';
import { ExpoSdkModule } from 'nestjs-expo-sdk';
import { NotificationTokens } from '../notification-tokens/notification-tokens.entity';
import { Recipe } from '../recipe/recipe.entity';
import { UserFollow } from '../user-follow/user-follow.entity';
import { RecipeFavorite } from '../recipe-favorite/recipe-favorite.entity';
import { Place } from '../place/place.entity';
import { PackageType } from '../package-type/package-type.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  // TypeOrmModule.forFeature() allows to import Modules with circular dependencies
  imports: [
    ExpoSdkModule.forRoot(
      {
        accessToken: process.env.EXPO_ACCESS_TOKEN,
      },
      true,
    ), MailModule, TypeOrmModule.forFeature([User, UserDocuments, Language, DataTranslate, NotificationTokens, RecipeFavorite, UserFollow, Recipe, Place, PackageType]), UserSubscriber],
  exports: [UserService],
})
export class UserModule { }
