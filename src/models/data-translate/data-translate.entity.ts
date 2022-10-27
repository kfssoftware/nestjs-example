import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Language } from '../language/language.entity';

@Entity()
export class DataTranslate extends BaseEntity {

  @Column()
  languageId: number;

  @Column({ nullable: true })
  keyword: string;

  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => Language)
  @JoinColumn()
  language: Language;
}
