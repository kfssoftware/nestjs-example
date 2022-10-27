import { YesNo } from "src/common/enums";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "../user/user.entity";
import { Recipe } from "../recipe/recipe.entity";

@Entity()
export class RecipeRates extends BaseEntity {

  @Column()
  userId: number;

  @Column()
  recipeId: number;

  @Column({ default: 0 })
  rateType: number;

  @ManyToOne(() => Recipe, recipe => recipe.recipeRates)
  recipe: Recipe;

  @ManyToOne(() => User, user => user.recipeRates)
  @JoinColumn()
  user: User;
};