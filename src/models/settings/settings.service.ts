import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Settings } from './settings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateSettingsDto, SettingsDto, SettingsFilterDto, UpdateSettingsDto } from "./settings.dtos";

@Injectable()
export class SettingsService extends BaseService<
  Settings,
  CreateSettingsDto,
  UpdateSettingsDto,
  SettingsDto
> {
  constructor(@InjectRepository(Settings) public repository: Repository<Settings>) {
    super();
  }
}
