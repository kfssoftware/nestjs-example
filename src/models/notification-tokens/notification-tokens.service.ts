import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/base.service';
import { Repository } from 'typeorm';
import { CreateNotificationTokensDto, FilterNotificationTokensDto, NotificationTokensDto, SendNotifDto, UpdateNotificationTokensDto } from './notification-tokens.dtos';
import { NotificationTokens } from './notification-tokens.entity';
import { User } from '../user/user.entity';
import { ResException } from 'src/common/resException';
import { InjectExpo } from 'nestjs-expo-sdk';
import { Status } from 'src/common/enums';

@Injectable()
export class NotificationTokensService extends BaseService<
NotificationTokens,
CreateNotificationTokensDto,
UpdateNotificationTokensDto,
NotificationTokensDto
> {
    constructor(
        @InjectRepository(NotificationTokens) public repository: Repository<NotificationTokens>,
        @InjectRepository(User) public userRepository: Repository<User>,
        @InjectExpo() private expo: any
    ) {
        super();
    };

    async _create(user: User, createNotificationTokensDto: CreateNotificationTokensDto) {
        try {
            createNotificationTokensDto.userId = user.id;
            const tokenControl = await this.repository.findOne(undefined, { where: { userId: user.id, token: createNotificationTokensDto.token } });
            if (!tokenControl)
                await this.repository.insert(createNotificationTokensDto);

            return {
                data: true,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null
            };
        } catch (error) {
            console.log(error);
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error.message,
            );
        };
    };

    async _delete(user: User, createNotificationTokensDto: CreateNotificationTokensDto) {
        try {
            createNotificationTokensDto.userId = user.id
            const resData = await this.repository.findOne(undefined, { where: { userId: user.id, token: createNotificationTokensDto.token } });
            if (resData)
                await this.repository.delete(resData.id);
            return {
                data: resData as NotificationTokens,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null
            };
        } catch (error) {
            console.log(error);
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error.message,
            );
        };
    };

    async sendNotif(sendNotifDto: SendNotifDto) {
        try {
            const getAssociatedUsers = await this.userRepository.find({ where: { email: sendNotifDto.email, status: Status.Active }, relations: ['notificationTokens'] });
            let messages = [];
            let responseLog = [];
            if (getAssociatedUsers && getAssociatedUsers.length > 0) {
                await Promise.all(
                    getAssociatedUsers.map(async (userItem: User) => {
                        if (userItem.notificationTokens) {
                            await Promise.all(userItem.notificationTokens.map(async (item: NotificationTokens) => {
                                messages.push({
                                    to: item.token,
                                    sound: 'default',
                                    title: sendNotifDto.title,
                                    body: sendNotifDto.body,
                                    data: sendNotifDto.data
                                });
                            }));
                        }
                    }));

                let chunks = this.expo.chunkPushNotifications(messages);
                let tickets = [];

                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await this.expo.sendPushNotificationsAsync(messages);
                        responseLog.push(ticketChunk);
                        console.log(ticketChunk);
                        tickets.push(...ticketChunk);
                    } catch (error) {
                        responseLog.push(error);
                        console.error(error);
                    }
                }
            }
            return {
                data: responseLog,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null
            };
        } catch (error) {
            console.log(error);
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error.message,
            );
        };
    };
}
