import { Body, Controller, Param, Post } from '@nestjs/common';
import { EnumService } from './enum.service';

@Controller('enum')
export class EnumController {
    constructor(private readonly enumService: EnumService) { }

    @Post('/:type')
    async list(@Param('type') type: string) {
        return this.enumService.list(type);
    }
}