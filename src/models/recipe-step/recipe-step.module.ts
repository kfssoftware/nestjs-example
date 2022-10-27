import { Module } from '@nestjs/common';
import { RecipeStepController } from './recipe-step.controller';
import { RecipeStepService } from './recipe-step.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeStep } from './recipe-step.entity';

@Module({
  controllers: [RecipeStepController],
  providers: [RecipeStepService],
  imports: [TypeOrmModule.forFeature([RecipeStep])],
})
export class RecipeStepModule {}