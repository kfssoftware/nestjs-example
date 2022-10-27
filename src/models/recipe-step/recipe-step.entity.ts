import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { QuantityType, UserType } from 'src/common/enums';
import { Recipe } from '../recipe/recipe.entity';

@Entity()
export class RecipeStep extends BaseEntity {

  @Column()
  recipeId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ default: false, nullable: true })
  optional: Boolean;

  @ManyToOne(() => Recipe, recipe => recipe.recipeSteps)
  recipe: Recipe;

}
