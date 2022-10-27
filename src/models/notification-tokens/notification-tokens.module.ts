import { Module } from '@nestjs/common';
import { NotificationTokensController } from './notification-tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTokens } from './notification-tokens.entity';
import { NotificationTokensService } from './notification-tokens.service';
import { ExpoSdkModule } from 'nestjs-expo-sdk';
import { User } from '../user/user.entity';

@Module({
  controllers: [NotificationTokensController],
  providers: [NotificationTokensService],
  imports: [ExpoSdkModule.forRoot(
    {
      accessToken: process.env.EXPO_ACCESS_TOKEN,
    },
    true,
  ), TypeOrmModule.forFeature([NotificationTokens,User])],
})
export class NotificationTokensModule { }