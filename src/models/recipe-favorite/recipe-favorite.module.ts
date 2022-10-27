import { Module } from '@nestjs/common';
import { RecipeFavoriteController } from './recipe-favorite.controller';
import { RecipeFavoriteService } from './recipe-favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeFavorite } from './recipe-favorite.entity';

@Module({
  controllers: [RecipeFavoriteController],
  providers: [RecipeFavoriteService],
  imports: [TypeOrmModule.forFeature([RecipeFavorite])],
})
export class RecipeFavoriteModule {}