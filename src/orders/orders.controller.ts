import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './order.dto';
import { OrderStatusValue } from './order-status.enum';

export class GetOrdersQueryDto {
  @IsOptional()
  @IsEnum(OrderStatusValue, {
    message: 'Status must be a valid order status',
  })
  status?: OrderStatusValue;
}

export class GetOrderByIdParamsDto {
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  id!: string;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto.meals);
  }

  @Get('/')
  async getOrders(@Query() query: GetOrdersQueryDto) {
    return this.ordersService.getOrders(query.status);
  }

  @Get('/:id')
  async getOrderById(@Param() params: GetOrderByIdParamsDto) {
    return this.ordersService.getOrderById(params.id);
  }
}
