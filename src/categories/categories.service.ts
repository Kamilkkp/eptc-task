import { Injectable } from '@nestjs/common';
import { CategoryValue } from './category.enum';

@Injectable()
export class CategoriesService {
  public getAvailableCategories() {
    return Object.values(CategoryValue);
  }
}
