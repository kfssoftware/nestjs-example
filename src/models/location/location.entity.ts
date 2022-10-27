import { Column, Entity, Tree, TreeChildren, TreeParent, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity()
@Tree("closure-table")
export class Location extends BaseEntity {

  @Index()
  @Column({ length: 50 })
  name: string;

  @Column({ length: 250 })
  fullName: string;

  @Column({ type: "float", nullable: true })
  latitude: number

  @Column({ type: "float", nullable: true })
  longitude: number;

  @TreeChildren()
  children: Location[];

  @Index()
  @TreeParent()
  parentLocation: Location;
};
