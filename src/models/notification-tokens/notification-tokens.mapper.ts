import { NotificationTokens } from './notification-tokens.entity';
import { NotificationTokensDto } from './notification-tokens.dtos';
import { plainToClass } from 'class-transformer';

export class NotificationTokensMapper {
  public static ModelToDto(notificationTokens: NotificationTokens) {
    var notificationTokensModel = new NotificationTokensDto();
    Object.keys(plainToClass(NotificationTokensDto, notificationTokens)).forEach(value => {
      notificationTokensModel[value] = notificationTokens[value]
    });
    return notificationTokensModel;
  }
}