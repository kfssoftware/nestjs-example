import { UserDocuments } from './user-documents.entity';
import { UserDocumentsDto } from './user-documents.dtos';
import { DocumentTypeLabel, UserTypeLabel } from 'src/common/enums';
import { plainToClass } from 'class-transformer';

export class UserDocumentsMapper {
  public static ModelToDto(userDocuments: UserDocuments) {
    var documentTypeLabel: any = DocumentTypeLabel;
    var userTypeLabel: any = UserTypeLabel;
    var userDocumentsModel = new UserDocumentsDto();
    Object.keys(plainToClass(UserDocumentsDto, userDocuments)).forEach(value => {
      userDocumentsModel[value] = userDocuments[value];
    });
    userDocumentsModel.documentTypeName = documentTypeLabel.get(Number(userDocuments.documentType));
    userDocumentsModel.userTypeName = userTypeLabel.get(Number(userDocuments.userType));
    return userDocumentsModel;
  };
};