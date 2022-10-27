import { UserCertificate } from './user-certificate.entity';
import { UserCertificateDto } from './user-certificate.dtos';
import { plainToClass } from 'class-transformer';

export class UserDocumentsMapper {
  public static ModelToDto(userCertificate: UserCertificate) {
    var userCertificateModel = new UserCertificateDto();
    Object.keys(plainToClass(UserCertificateDto, userCertificate)).forEach(value => {
      userCertificateModel[value] = userCertificate[value];
    });
    return userCertificateModel;
  };
};