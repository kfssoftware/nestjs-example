import { Body, Controller, Delete, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserCertificateDto, UpdateUserCertificateDto } from "./user-certificate.dtos";
import { UserCertificateService } from './user-certificate.service';

@Controller('UserCertificate')
export class UserCertificateController {
  constructor(private readonly userCertificateService: UserCertificateService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createUserCertificateDto: CreateUserCertificateDto) {
    createUserCertificateDto.userId = req?.user?.id;
    return this.userCertificateService.create(createUserCertificateDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  list() {
    return this.userCertificateService.list();
  }

  @Put('confirm/:id')
  @UseGuards(JwtAuthGuard)
  confirmUser(@Param('id') id: string) {
    return this.userCertificateService.confirm(+id);
  }


  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.userCertificateService.updateStatus(+id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserCertificateDto: UpdateUserCertificateDto) {
    return this.userCertificateService.update(+id, updateUserCertificateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.userCertificateService.delete(+id);
  }
}
