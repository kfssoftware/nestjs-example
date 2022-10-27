import { SetMetadata } from '@nestjs/common';
import { RoleActionEnum } from './enums';

export const ROLES_KEY = 'roleActions';
export const RoleActions = (...roleActions: RoleActionEnum[]) => SetMetadata(ROLES_KEY, roleActions);