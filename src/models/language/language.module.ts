import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { DataTranslate } from '../data-translate/data-translate.entity';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService],
  imports: [TypeOrmModule.forFeature([Language, DataTranslate])],
})
export class LanguageModule { }
