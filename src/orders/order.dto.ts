import { IsIn, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Meal } from '../meals/meal';

export class MealDto {
  @IsNotEmpty()
  @IsIn(Meal.getAvailableMeals().map((meal) => meal.getName()))
  name!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  meals!: MealDto[];
}
