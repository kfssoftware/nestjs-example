import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeMaterial } from '../recipe-material/recipe-material.entity';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import { DataTranslate } from '../data-translate/data-translate.entity';
import { ExpoSdkModule } from 'nestjs-expo-sdk';
import { MailModule } from '../mail/mail.module';
import { RecipeStep } from '../recipe-step/recipe-step.entity';
import { RecipeComment } from '../recipe-comment/recipe-comment.entity';
import { RecipeRates } from '../recipe-rates/recipe-rates.entity';
import { RecipeSaved } from '../recipe-saved/recipe-saved.entity';
import { RecipeFavorite } from '../recipe-favorite/recipe-favorite.entity';
import { UserFollow } from '../user-follow/user-follow.entity';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [ExpoSdkModule.forRoot(
    {
      accessToken: process.env.EXPO_ACCESS_TOKEN,
    },
    true,
  ), MailModule, TypeOrmModule.forFeature([Recipe, RecipeMaterial, RecipeStep, Category, User, DataTranslate, RecipeComment, RecipeRates, RecipeSaved, RecipeFavorite, UserFollow])],
})
export class RecipeModule { }