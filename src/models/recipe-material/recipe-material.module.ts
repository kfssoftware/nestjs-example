import { Module } from '@nestjs/common';
import { RecipeMaterialController } from './recipe-material.controller';
import { RecipeMaterialService } from './recipe-material.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeMaterial } from './recipe-material.entity';

@Module({
  controllers: [RecipeMaterialController],
  providers: [RecipeMaterialService],
  imports: [TypeOrmModule.forFeature([RecipeMaterial])],
})
export class RecipeMaterialModule {}