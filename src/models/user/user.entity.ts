import { Column, Connection, Entity, EntitySubscriberInterface, EventSubscriber, InsertEvent, JoinColumn, ManyToOne, OneToMany, UpdateEvent } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PackageTypeEnum, PlaceType, UserType } from 'src/common/enums';
import { BaseEntity } from '../base/base.entity';
import { Role } from '../role/role.entity';
import { Language } from '../language/language.entity';
import { UserDocuments } from '../user-documents/user-documents.entity';
import { NotificationTokens } from '../notification-tokens/notification-tokens.entity';
import { RecipeRates } from '../recipe-rates/recipe-rates.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { Place } from '../place/place.entity';
import { PlaceRates } from '../place-rates/place-rates.entity';
import { UserPayments } from '../user-payments/user-payments.entity';
import { BasketList } from '../basket-list/basket-list.entity';
import { ProductRates } from '../product-rates/product-rates.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  fullname: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  socialUserId: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  password: string | null;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.Admin
  })
  public userType: UserType

  @Column({
    type: 'enum',
    enum: PackageTypeEnum,
    default: PackageTypeEnum.Basic
  })
  public packageType: PackageTypeEnum

  @Column({ nullable: true })
  placeId: number;

  @Column({ nullable: true })
  roleId: number;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ nullable: true })
  appNotifActive: Boolean;

  @Column({ nullable: true })
  appMailActive: Boolean;

  @Column({ nullable: true })
  languageId: number;

  @Column({ type: 'varchar', length: 100, nullable: true, select: true })
  passwordKey: string;

  @Column({ type: 'varchar', length: 100, nullable: true, select: true })
  emailKey: string;

  @Column({ type: 'text', nullable: true })
  profilePhoto: string;

  @Column({ type: 'text', nullable: true })
  video: string;

  @Column({ nullable: true })
  confirm: Boolean;

  @Column({ type: 'double precision', default: 0 })
  point: number;

  @Column({ default: 0 })
  rateCount: number;

  @Column({ default: 0 })
  rateSum: number;

  @Column({ type: 'double precision', default: 0 })
  rateAvg: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  emailConfirm: Boolean;

  @ManyToOne(() => Role)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Language)
  @JoinColumn()
  language: Language;

  @OneToMany(() => NotificationTokens, notificationTokens => notificationTokens.user)
  @JoinColumn()
  notificationTokens: NotificationTokens[];

  @OneToMany(() => UserDocuments, userDocuments => userDocuments.user)
  @JoinColumn()
  userDocuments: UserDocuments[];

  @OneToMany(() => UserPayments, userPayments => userPayments.user)
  @JoinColumn()
  userPayments: UserPayments[];

  @OneToMany(() => Place, place => place.user)
  @JoinColumn()
  places: Place[];

  @ManyToOne(() => RecipeRates)
  @JoinColumn()
  recipeRates: RecipeRates;

  @ManyToOne(() => PlaceRates)
  @JoinColumn()
  placeRates: PlaceRates;

  @ManyToOne(() => ProductRates)
  @JoinColumn()
  productRates: ProductRates;

  @OneToMany(() => ShoppingList, shoppingList => shoppingList.user)
  @JoinColumn()
  shoppingList: ShoppingList[];

  @OneToMany(() => BasketList, basketList => basketList.user)
  @JoinColumn()
  basketList: BasketList[];

}

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    connection: Connection,
    private readonly configService: ConfigService
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const user = event.entity;

    if (user.password) {
      user.password = await bcrypt.hash(
        user.password,
        Number(this.configService.get<number>('AUTH_SALT_ROUNDS')),
      );
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const user = event.entity;
    const hashRegex = /^(\$[0-9][a-z]\$[0-9]{2}\$).{53}$/;

    if (user.password && !hashRegex.test(user.password)) {
      user.password = await bcrypt.hash(
        user.password,
        Number(this.configService.get<number>('AUTH_SALT_ROUNDS')),
      );
    }
  }
}