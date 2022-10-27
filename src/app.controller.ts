import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as package_json from '../package.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health') health() {
    return this.version();
  }

  @Get('version') version() {
    return { version: package_json.version };
  }
}
