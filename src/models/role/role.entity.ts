import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserType } from 'src/common/enums';

@Entity()
export class Role extends BaseEntity {

  @Column({ length: 30 })
  name: string;

  @Column("smallint", { array: true, nullable: true })
  actions: number[];

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.Admin
  })
  public userType: UserType
}
