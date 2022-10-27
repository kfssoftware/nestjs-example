import { Body, Controller, Delete, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateNotificationTokensDto, SendNotifDto } from './notification-tokens.dtos';
import { NotificationTokensService } from './notification-tokens.service';

@Controller('notification-tokens')
export class NotificationTokensController {
    constructor(private notificationTokensService: NotificationTokensService) { };

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req, @Body() createNotificationTokensDto: CreateNotificationTokensDto) {
        return this.notificationTokensService._create(req.user, createNotificationTokensDto);
    }

    @Post('sendNotif')
    sendNotif(@Body() sendNotifDto: SendNotifDto) {
        return this.notificationTokensService.sendNotif(sendNotifDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    delete(@Request() req, @Body() createNotificationTokensDto: CreateNotificationTokensDto) {
        return this.notificationTokensService._delete(req.user, createNotificationTokensDto);
    }
}
