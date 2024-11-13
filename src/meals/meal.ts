import { CategoryValue } from '../categories/category.enum';

interface MealProps {
  name: string;
  category: CategoryValue;
  price: number;
}

export class Meal {
  constructor(private readonly props: MealProps) {}

  public static readonly SPICY_MISO_TONKOTSU_RAMEN = new Meal({
    name: 'Spicy Miso Tonkotsu Ramen',
    category: CategoryValue.Ramen,
    price: 40,
  });

  public static readonly SHOYU_RAMEN_WITH_GRILLED_CHICKEN = new Meal({
    name: 'Shoyu Ramen with Grilled Chicken',
    category: CategoryValue.Ramen,
    price: 55,
  });

  public static readonly CHIRASHI_SUSHI = new Meal({
    name: 'Chirashi Sushi',
    category: CategoryValue.Sushi,
    price: 60,
  });

  public static readonly UNI_AND_TORO_SUSHI = new Meal({
    name: 'Uni and Toro Sushi',
    category: CategoryValue.Sushi,
    price: 62,
  });

  public getName() {
    return this.props.name;
  }

  public getCategory() {
    return this.props.category;
  }

  public getPrice() {
    return this.props.price;
  }

  public static getAvailableMeals() {
    return [
      Meal.CHIRASHI_SUSHI,
      Meal.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
      Meal.SPICY_MISO_TONKOTSU_RAMEN,
      Meal.UNI_AND_TORO_SUSHI,
    ];
  }
}
