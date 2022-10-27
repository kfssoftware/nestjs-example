import { Module } from '@nestjs/common';
import { RecipeCommentController } from './recipe-comment.controller';
import { RecipeCommentService } from './recipe-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeComment } from './recipe-comment.entity';

@Module({
  controllers: [RecipeCommentController],
  providers: [RecipeCommentService],
  imports: [TypeOrmModule.forFeature([RecipeComment])],
})
export class RecipeCommentModule {}