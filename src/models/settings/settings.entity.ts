import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity()
export class Settings extends BaseEntity {
  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  taxNo: string;

  @Column({ nullable: true })
  taxAdministration: string;

  @Column({ nullable: true })
  siteTitle: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  phone2: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  facebookApp: string;

  @Column({ nullable: true })
  twitterApp: string;

  @Column({ nullable: true })
  instagramApp: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  privacy: string;

  @Column({ nullable: true })
  mail: string;
}
