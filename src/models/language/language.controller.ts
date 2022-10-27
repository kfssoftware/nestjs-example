import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageFilterDto, CreateLanguageDto, UpdateLanguageDto } from './language.dtos';
import { RoleActions } from 'src/common/roles.decorator';
import { RoleActionEnum, Status } from 'src/common/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Post('list')
  async list(@Body() languageFilterDto: LanguageFilterDto) {
    const data = await this.languageService._list('language', languageFilterDto);
    return data;
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.LanguageUpdate)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.languageService.updateStatus(+id, status);
  }

  @Post('dropdown')
  dropdown() {
    return this.languageService.dropdown({ where: { status: Status.Active } });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  detail(@Param('id') id: string) {
    return this.languageService.detail(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languageService.update(+id, updateLanguageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.languageService.deleteLanguage(+id);
  }
}
