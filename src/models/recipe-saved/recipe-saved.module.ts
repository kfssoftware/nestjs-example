import { Module } from '@nestjs/common';
import { RecipeSavedController } from './recipe-saved.controller';
import { RecipeSavedService } from './recipe-saved.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeSaved } from './recipe-saved.entity';

@Module({
  controllers: [RecipeSavedController],
  providers: [RecipeSavedService],
  imports: [TypeOrmModule.forFeature([RecipeSaved])],
})
export class RecipeSavedModule {}