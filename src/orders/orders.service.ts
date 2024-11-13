import { Injectable, NotFoundException } from '@nestjs/common';
import { Job, Queue, Worker } from 'bullmq';
import { v4 as uuid4 } from 'uuid';
import { Meal } from '../meals/meal';
import { MealDto } from './order.dto';
import { OrderStatusValue } from './order-status.enum';

export interface OrderPayload {
  id: string;
  status: OrderStatusValue;
  totalPrice: number;
  meals: MealDto[];
}

@Injectable()
export class OrdersService {
  private orderQueue: Queue;
  private orderWorker: Worker;

  constructor() {
    this.orderQueue = new Queue('orderQueue', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || '6379'),
      },
    });

    this.orderWorker = new Worker(
      'orderQueue',
      async (job: Job<OrderPayload>) => {
        await this.processOrder(job.data.id);
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT || '6379'),
        },
      },
    );
  }

  async createOrder(meals: MealDto[]): Promise<OrderPayload> {
    const order: OrderPayload = {
      id: uuid4(),
      status: OrderStatusValue.NEW,
      meals: meals,
      totalPrice: meals.reduce(
        (total, meal) =>
          total +
          (Meal.getAvailableMeals()
            .find((availableMeal) => availableMeal.getName() === meal.name)
            ?.getPrice() ?? 0) *
            meal.quantity,
        0,
      ),
    };

    await this.orderQueue.add('order', order, { jobId: order.id });

    return order;
  }

  async getOrderById(id: string): Promise<OrderPayload | undefined> {
    const order = await this.orderQueue.getJob(id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order.data;
  }

  async getOrders(status?: OrderStatusValue): Promise<OrderPayload[]> {
    const allOrders = await this.orderQueue.getJobs();

    return (
      status
        ? allOrders.filter((order) => order.data.status === status)
        : allOrders
    ).map((order) => order.data);
  }

  private async processOrder(orderId: string) {
    const order = await this.orderQueue.getJob(orderId);

    if (!order) throw new Error('Order not found');

    order.data.status = OrderStatusValue.IN_THE_KITCHEN;
    await order.updateData(order.data);
    await new Promise((resolve) => setTimeout(resolve, 550));

    order.data.status = OrderStatusValue.IN_DELIVERY;
    await order.updateData(order.data);
    await new Promise((resolve) => setTimeout(resolve, 600));

    order.data.status = OrderStatusValue.DONE;
    await order.updateData(order.data);
    console.log(`Order ${orderId} completed.`);
  }
}
