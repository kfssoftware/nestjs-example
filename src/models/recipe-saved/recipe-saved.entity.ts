import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Recipe } from '../recipe/recipe.entity';
import { User } from '../user/user.entity';

@Entity()
export class RecipeSaved extends BaseEntity {

  @Column()
  recipeId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Recipe, recipe => recipe.recipeSaved)
  recipe: Recipe;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
