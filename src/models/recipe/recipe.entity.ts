import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Category } from '../category/category.entity';
import { RecipeRates } from '../recipe-rates/recipe-rates.entity';
import { User } from '../user/user.entity';
import { RecipeMaterial } from '../recipe-material/recipe-material.entity';
import { RecipeStep } from '../recipe-step/recipe-step.entity';
import { RecipeComment } from '../recipe-comment/recipe-comment.entity';
import { RecipeFavorite } from '../recipe-favorite/recipe-favorite.entity';
import { ServiceType, TimeType } from 'src/common/enums';
import { RecipeSaved } from '../recipe-saved/recipe-saved.entity';
import { MenuRecipe } from '../menu-recipe/menu-recipe.entity';

@Entity()
export class Recipe extends BaseEntity {

  @Column()
  userId: number;

  @Column()
  categoryId: number;

  @Column({ length: 200, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  calorie: string;

  @Column({ type: 'text', nullable: true })
  service: string;

  @Column({ type: "enum", enum: ServiceType, nullable: true })
  serviceType: ServiceType;

  @Column({ type: 'text', nullable: true })
  cookingTime: string;

  @Column({ type: "enum", enum: TimeType, nullable: true })
  cookingTimeType: TimeType;

  @Column({ type: 'text', nullable: true })
  preparationTime: string;

  @Column({ type: "enum", enum: TimeType, nullable: true })
  preparationTimeType: TimeType;

  @Column({ type: 'text', nullable: true })
  seoLink: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  rateCount: number;

  @Column({ default: 0 })
  rateSum: number;

  @Column({ type: 'double precision', default: 0 })
  rateAvg: number;

  @Column({ default: false })
  wheel: boolean;

  @Column({ default: false })
  confirm: boolean;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => RecipeMaterial, recipeMaterial => recipeMaterial.recipe)
  @JoinColumn()
  recipeMaterials: RecipeMaterial[];

  @OneToMany(() => RecipeRates, recipeRates => recipeRates.recipe)
  @JoinColumn()
  recipeRates: RecipeRates[];

  @OneToMany(() => RecipeStep, recipeStep => recipeStep.recipe)
  @JoinColumn()
  recipeSteps: RecipeStep[];

  @OneToMany(() => RecipeComment, recipeComment => recipeComment.recipe)
  @JoinColumn()
  recipeComments: RecipeComment[];

  @OneToMany(() => RecipeFavorite, recipeFavorite => recipeFavorite.recipe)
  @JoinColumn()
  recipeFavorites: RecipeFavorite[];

  @OneToMany(() => RecipeSaved, recipeSaved => recipeSaved.recipe)
  @JoinColumn()
  recipeSaved: RecipeSaved[];

  @OneToMany(() => MenuRecipe, menuRecipe => menuRecipe.recipe)
  @JoinColumn()
  menuRecipe: MenuRecipe[];

}