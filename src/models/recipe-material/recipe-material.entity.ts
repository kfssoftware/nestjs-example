import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { QuantityType, UserType } from 'src/common/enums';
import { Recipe } from '../recipe/recipe.entity';
import { Material } from '../material/material.entity';

@Entity()
export class RecipeMaterial extends BaseEntity {

  @Column()
  recipeId: number;

  @Column()
  materialId: number;

  @Column({ type: 'text', nullable: true })
  aim: string;

  @Column({ type: 'double precision', default: 0 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: QuantityType,
    default: QuantityType.Gram
  })
  public quantityType: QuantityType

  @Column({ default: false, nullable: true })
  optional: Boolean;

  @ManyToOne(() => Material)
  @JoinColumn()
  material: Material;

  @ManyToOne(() => Recipe, recipe => recipe.recipeMaterials)
  recipe: Recipe;

}
