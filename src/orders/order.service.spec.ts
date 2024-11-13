import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrderStatusValue } from './order-status.enum';

describe('OrderService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should create a new order', async () => {
    const meals = [
      {
        name: 'Shoyu Ramen with Grilled Chicken',
        quantity: 2,
      },
    ];
    const order = await service.createOrder(meals);

    expect(order).toBeDefined();
    expect(order.status).toBe(OrderStatusValue.NEW);
    expect(order.totalPrice).toBe(110);
  });
});
