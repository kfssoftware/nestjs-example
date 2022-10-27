import { Body, Controller, Delete, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateUserDocumentsDto, UpdateUserDocumentsDto } from "./user-documents.dtos";
import { UserDocumentsService } from './user-documents.service';

@Controller('UserDocuments')
export class UserDocumentsController {
    constructor(private readonly userDocumentsService: UserDocumentsService) { }

  @Post()
  @RoleActions(RoleActionEnum.UserDocumentsCreate)
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDocumentsDto: CreateUserDocumentsDto) {
    return this.userDocumentsService.create(createUserDocumentsDto);
  }
  
  @Post('list')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserDocumentsList)
  list() {
    return this.userDocumentsService.list();
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserDocumentsUpdate)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.userDocumentsService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserDocumentsUpdate)
  update(@Param('id') id: string, @Body() updateUserDocumentsDto: UpdateUserDocumentsDto) {
    return this.userDocumentsService.update(+id, updateUserDocumentsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.UserDocumentsDelete)
  delete(@Param('id') id: string) {
    return this.userDocumentsService.delete(+id);
  }
}
