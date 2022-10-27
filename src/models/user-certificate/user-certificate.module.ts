import { Module } from '@nestjs/common';
import { UserCertificateController } from './user-certificate.controller';
import { UserCertificateService } from './user-certificate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCertificate } from './user-certificate.entity';
import { User } from '../user/user.entity';

@Module({
  controllers: [UserCertificateController],
  providers: [UserCertificateService],
  imports: [TypeOrmModule.forFeature([UserCertificate, User])],
})
export class UserCertificateModule { }