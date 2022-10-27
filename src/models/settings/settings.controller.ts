import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('')
  detail() {
    return this.settingsService.detail(1);
  }
}

