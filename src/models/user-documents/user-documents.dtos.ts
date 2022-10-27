import { ApiProperty } from '@nestjs/swagger';
import { UserType, DocumentType } from 'src/common/enums';
import { PartialType } from '@nestjs/swagger';
import { BaseListDto } from '../base/base.list.dto';

export class CreateUserDocumentsDto {
  @ApiProperty() userId: number;

  @ApiProperty() documentUrl: string;

  @ApiProperty() documentType: DocumentType;

  @ApiProperty() userType: UserType;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateUserDocumentsDto extends PartialType(CreateUserDocumentsDto) {}


export class UserDocumentsDto extends BaseListDto {
  @ApiProperty()
  userId: number;

  @ApiProperty({ type: 'text', nullable: true })
  documentUrl: string;

  @ApiProperty({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.Certificates
  })
  public documentType: DocumentType

  @ApiProperty({
    type: 'enum',
    enum: UserType,
    default: UserType.User
  })
  public userType: UserType

  @ApiProperty()
  documentTypeName: string;

  @ApiProperty()
  userTypeName: string;
}