import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Recipe } from '../recipe/recipe.entity';
import { User } from '../user/user.entity';

@Entity()
export class RecipeComment extends BaseEntity {

  @Column()
  recipeId: number;

  @Column()
  userId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Recipe, recipe => recipe.recipeComments)
  recipe: Recipe;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

}
