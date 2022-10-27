import { Module } from '@nestjs/common';
import { UserDocumentsController } from './user-documents.controller';
import { UserDocumentsService } from './user-documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDocuments } from './user-documents.entity';

@Module({
  controllers: [UserDocumentsController],
  providers: [UserDocumentsService],
  imports: [TypeOrmModule.forFeature([UserDocuments])],
})
export class UserDocumentsModule {}