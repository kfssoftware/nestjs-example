import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { DataTranslate } from '../data-translate/data-translate.entity';
@Entity()
export class Language extends BaseEntity {

  @Column({ length: 30 })
  name: string;

  @Column({ length: 5 })
  shortName: string;

  @Column()
  isRtl: boolean;

  @Column()
  isDefault: boolean;

  @OneToMany(() => DataTranslate, dataTranslate => dataTranslate.language)
  @JoinColumn()
  dataTranslate: DataTranslate[];
}
