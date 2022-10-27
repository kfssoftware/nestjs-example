import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../base/base.filter.dto';
import { UserDto } from '../user/user.dtos';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';
import { BaseListDto } from '../base/base.list.dto';
import { RecipeOrderFilter, ServiceType, ServiceTypeFilter, TimeType, TimeTypeFilter } from 'src/common/enums';

export class CreateRecipeDto {
  @ApiProperty({ nullable: true }) userId: number | null; //Made for request creation from the Admin panel in the future

  @ApiProperty() categoryId: number;

  @ApiProperty() confirm: boolean;

  @ApiProperty({})
  seoLink: string | null;

  @ApiProperty({ maxLength: 200 })
  title: string | null;

  @ApiProperty({ maxLength: 250 })
  description: string | null;

  @ApiProperty()
  calorie: string | null;

  @ApiProperty() imageUrl: string;

  @ApiProperty({})
  service: string | null;

  @ApiProperty() serviceType?: ServiceType;

  @ApiProperty({})
  cookingTime: string | null;

  @ApiProperty() cookingTimeType?: TimeType;

  @ApiProperty({})
  preparationTime: string | null;

  @ApiProperty() preparationTimeType?: TimeType;

  @ApiProperty() materials: Array<any>;

  @ApiProperty() steps: Array<any>;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class UpdateRecipeDto {

  @ApiProperty() categoryId: number;

  @ApiProperty({})
  seoLink: string | null;

  @ApiProperty({ maxLength: 200 })
  title: string | null;

  @ApiProperty({ maxLength: 250 })
  description: string | null;

  @ApiProperty()
  calorie: string | null;

  @ApiProperty() imageUrl: string;

  @ApiProperty({})
  service: string | null;

  @ApiProperty() serviceType?: ServiceType;

  @ApiProperty({})
  cookingTime: string | null;

  @ApiProperty() cookingTimeType?: TimeType;

  @ApiProperty({})
  preparationTime: string | null;

  @ApiProperty() preparationTimeType?: TimeType;

  constructor(object: any) {
    Object.assign(this, object);
  }
}

export class RecipeFilterDto extends BaseFilterDto {
  @ApiProperty() userId: number;

  @ApiProperty() title: string;

  @ApiProperty() description: string;

  @ApiProperty() categoryId: number;

  @ApiProperty() wheel: boolean;

  @ApiProperty() seoLink: string;

  @ApiProperty() serviceTypeFilterId: ServiceTypeFilter;

  @ApiProperty() preparationTimeTypeFilterId: TimeTypeFilter;

  @ApiProperty() cookingTimeTypeFilterId: TimeTypeFilter;

  @ApiProperty() recipeOrderFilterId: RecipeOrderFilter;
}

export class RecipeDto extends BaseListDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  confirm: boolean;

  @ApiProperty({})
  seoLink: string | null;

  @ApiProperty({ maxLength: 200, nullable: true })
  title: string;

  @ApiProperty({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  calorie: string | null;

  @ApiProperty()
  service: string | null;

  @ApiProperty() serviceType?: ServiceType;

  @ApiProperty()
  cookingTime: string | null;

  @ApiProperty() cookingTimeType?: TimeType;

  @ApiProperty()
  preparationTime: string | null;

  @ApiProperty() preparationTimeType?: TimeType;

  @ApiProperty()
  preparationTimeTypeName: string;

  @ApiProperty()
  cookingTimeTypeName: string;

  @ApiProperty()
  serviceTypeName: string;

  @ApiProperty()
  viewCount: number;

  @ApiProperty({ default: 0 })
  rateCount: number;

  @ApiProperty({ default: 0 })
  rateSum: number;

  @ApiProperty({ type: 'double precision', default: 0 })
  rateAvg: number;

  @ApiProperty() rated: boolean;

  @ApiProperty() favorited: boolean;

  @ApiProperty() saved: boolean;

  @ApiProperty() userFollowed: boolean;

  @ApiProperty() recipeMaterials: Array<any>;

  @ApiProperty() recipeSteps: Array<any>;

  @ApiProperty() recipeRates: Array<any>;

  @ApiProperty() recipeComments: Array<any>;

}

export class RecipeDetailByUserDto {
  @ApiProperty()
  rated: boolean;

  @ApiProperty()
  saved: boolean;

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  followed: boolean;
}