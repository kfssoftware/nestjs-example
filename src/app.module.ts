import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as ormconfig from '../ormconfig';
import { RecipeRatesModule } from './models/recipe-rates/recipe-rates.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger-middleware.service';
import { UserModule } from './models/user/user.module';
import { RoleModule } from './models/role/role.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './models/language/language.module';
import { UploadFileModule } from './models/upload-file/upload-file.module';
import { RecipeModule } from './models/recipe/recipe.module';
import { DataTranslateModule } from './models/data-translate/data-translate.module';
import { RecipeMaterialModule } from './models/recipe-material/recipe-material.module';
import { EnumModule } from './models/enum/enum.module';
import { UserDocumentsModule } from './models/user-documents/user-documents.module';
import { NotificationTokensModule } from './models/notification-tokens/notification-tokens.module';
import { RecipeStepModule } from './models/recipe-step/recipe-step.module';
import { RecipeCommentModule } from './models/recipe-comment/recipe-comment.module';
import { RecipeFavoriteModule } from './models/recipe-favorite/recipe-favorite.module';
import { SettingsModule } from './models/settings/settings.module';
import { RecipeSavedModule } from './models/recipe-saved/recipe-saved.module';
import { UserCertificateModule } from './models/user-certificate/user-certificate.module';
import { LocationModule } from './models/location/location.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ormconfig as TypeOrmModuleOptions,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    SettingsModule,
    LanguageModule,
    RecipeSavedModule,
    RecipeModule,
    LocationModule,
    DataTranslateModule,
    RecipeMaterialModule,
    RecipeStepModule,
    RecipeCommentModule,
    RecipeRatesModule,
    RecipeFavoriteModule,  
    EnumModule,
    UploadFileModule,
    UserDocumentsModule,
    UserCertificateModule,
    NotificationTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    //this.logger.log(JSON.stringify(process.env));
  }
}
