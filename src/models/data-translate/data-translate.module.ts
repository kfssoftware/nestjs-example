import { Module } from '@nestjs/common';
import { DataTranslateController } from './data-translate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataTranslateService } from './data-translate.service';
import { DataTranslate } from './data-translate.entity';
import { Language } from '../language/language.entity';

@Module({
  controllers: [DataTranslateController],
  providers: [DataTranslateService],
  imports: [TypeOrmModule.forFeature([DataTranslate,Language])],
})
export class DataTranslateModule {}