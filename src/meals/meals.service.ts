import { Injectable } from '@nestjs/common';
import { Meal } from './meal';

@Injectable()
export class MealsService {
  public getAvailableMeals() {
    return Meal.getAvailableMeals().map((meal) => meal.getName());
  }
}
