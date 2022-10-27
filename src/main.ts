import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as package_json from '../package.json';
import { INestApplication } from '@nestjs/common';
import { UserService } from './models/user/user.service';
import { CreateUserDto } from './models/user/user.dtos';
import { LanguageService } from './models/language/language.service';
import { CreateLanguageDto } from './models/language/language.dtos';
import { RoleService } from './models/role/role.service';
import { CreateRoleDto } from './models/role/role.dtos';
import { UserType } from './common/enums';
import { General } from "./common/general";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle(package_json.name)
    .setDescription(package_json.description)
    .setVersion(package_json.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await createBaseData(app);
  await createDevData(app);

  await app.listen(3000);
}

bootstrap();

async function createBaseData(app: INestApplication) {
  const userService: UserService = app.get(UserService);
  const languageService: LanguageService = app.get(LanguageService);
  const roleService: RoleService = app.get(RoleService);
  let defaultLanguage = await languageService.detail(undefined, {
    where: { name: 'Türkçe' },
  });
  if (!defaultLanguage || !defaultLanguage.data) {
    await languageService.create(
      new CreateLanguageDto({
        name: 'Türkçe',
        shortName: 'TR',
        isRtl: false,
        isDefault: true
      }),
    );
  }
  let roleAdmin = await roleService.detail(undefined, {
    where: { name: 'admin' },
  });
  if (!roleAdmin || !roleAdmin.data) {
    await roleService.create(
      new CreateRoleDto({
        name: 'admin',
        actions: new General().getDefaultRoleActionIdList(),
        userType: UserType.Admin
      }),
    );
  }
  let admin = await userService.detail(undefined, {
    where: { username: 'admin' },
  });
  if (!admin || !admin.data) {
    await userService.create(
      new CreateUserDto({
        username: 'admin',
        password: 'admin',
        fullname: "Super Admin",
        phone: '0000000000',
        email: process.env.MAIL_USER,
        userType: UserType.Admin,
        roleId: (!roleAdmin || !roleAdmin.data) ? 1 : roleAdmin?.data.id,
        languageId: (!defaultLanguage || !defaultLanguage.data) ? 1 : defaultLanguage?.data.id,
        appNotifActive: false,
        appMailActive: false,
        confirm: true,
        emailConfirm: true
      }),
    );
  }
}

async function createDevData(app: INestApplication) { }
