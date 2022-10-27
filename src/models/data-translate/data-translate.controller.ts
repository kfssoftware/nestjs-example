import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { DataTranslateService } from './data-translate.service';
import { CreateDataTranslateDto, UpdateDataTranslateDto, DataTranslateFilterDto } from './data-translate.dtos';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActions } from 'src/common/roles.decorator';
import { RoleActionEnum } from 'src/common/enums';
@Controller('dataTranslate')
export class DataTranslateController {
  constructor(private readonly dataTranslateService: DataTranslateService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.TranslateCreate)
  create(@Body() createDataTranslateDto: CreateDataTranslateDto) {
    return this.dataTranslateService._create("data_translate", createDataTranslateDto);
  }

  @Post('list')
  async list(@Body() dataTranslateFilterDto: DataTranslateFilterDto) {
    const data = await this.dataTranslateService._list('data_translate', dataTranslateFilterDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('missing')
  async missing(@Body() dataTranslateFilterDto: DataTranslateFilterDto) {
    const data = await this.dataTranslateService.missingList('data_translate', dataTranslateFilterDto);
    return data;
  }

  @Post('dropdown/:languageId')
  dropdown(@Param('languageId') id: number) {
    return this.dataTranslateService._dropdown(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.dataTranslateService._detail(+id);
  }

  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.TranslateUpdate)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDataTranslateDto: UpdateDataTranslateDto) {
    return this.dataTranslateService._update(+id, updateDataTranslateDto);
  }

  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.TranslateDelete)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dataTranslateService.delete(+id);
  }
}
