import { RecipeRatesService } from './recipe-rates.service';
import { RecipeRatesController } from './recipe-rates.controller';
import { Module } from '@nestjs/common';
import { RecipeRates } from './recipe-rates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from '../recipe/recipe.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RecipeRates, Recipe])],
    controllers: [
        RecipeRatesController,],
    providers: [
        RecipeRatesService,],
})
export class RecipeRatesModule { }
