import {
  Injectable,
  BadRequestException,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Carts } from '../../entity/cart.entity';
import { CartItems } from '../../entity/cart-item.entity';
import { Orders } from '../../entity/order.entity';
import { OrderItems } from '../../entity/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    @InjectRepository(OrderItems)
    private orderItemRepository: Repository<Orders>,
    @InjectRepository(Carts)
    private cartRepository: Repository<Carts>,
    @InjectRepository(CartItems)
    private cartItemRepository: Repository<CartItems>,
  ) {}

  async createOrder(req: any) {
    let result;

    await this.cartRepository
      .query('SELECT id FROM carts WHERE userId = ?', [
        parseInt(req.user.userId),
      ])
      .then((data) => {
        result = data[0];
        return result;
      });

    // console.log(result);

    if (result == undefined) {
      throw new NotFoundException('Data not found');
    }

    const cartItem = await this.cartItemRepository.query(
      'SELECT cartitems.id, services.id AS itemId, serviceinfos.id AS itemInfoId, serviceinfos.duration AS itemDuration, serviceinfos.cost AS itemCost FROM cartitems INNER JOIN services ON cartitems.serviceId = services.id INNER JOIN serviceinfos ON cartitems.serviceInfoId = serviceinfos.id AND services.id = serviceinfos.serviceId WHERE cartitems.cartId = ?',
      [result.id],
    );
    if (cartItem.length < 1) {
      throw new BadRequestException('Please, add catalog to cart firstly');
    }

    const sumCost = cartItem
      .map((item) => item.itemCost)
      .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    const currentDate = new Date().toISOString();

    const insertOrder = await this.orderRepository.query(
      'INSERT INTO orders (date, cost, userId) VALUES (?, ?, ?)',
      [currentDate, sumCost, parseInt(req.user.userId)],
    );

    cartItem.forEach(async (item) => {
      await this.orderItemRepository.query(
        'INSERT INTO orderitems (orderId, serviceId, serviceInfoId) VALUES (?, ?, ?)',
        [insertOrder.insertId, item.itemId, item.itemInfoId],
      );
    });

    await this.cartItemRepository.query(
      'DELETE FROM cartitems WHERE cartId = ?',
      [result.id],
    );

    const objResult = {
      message: 'Create new order successfully',
      cost: sumCost,
    };

    return objResult;
  }

  async getOrders(req: any) {
    const orders = await this.orderRepository.query(
      'SELECT id, date, cost, status, slipPayment FROM orders WHERE userId = ?',
      [parseInt(req.user.userId)],
    );

    const mappingOrders = orders.map((order) => {
      const obj = {
        id: order.id,
        data: {
          date: order.date,
          cost: order.cost,
          status: order.status,
          slipPayment: order.slipPayment,
        },
      };
      return obj;
    });

    const objResult = {
      message: 'Get orders successfully',
      data: mappingOrders,
    };
    return objResult;
  }

  async getSingleOrder(req: any, orderId: string) {
    let getOrder;

    await this.orderRepository
      .query(
        'SELECT id, date, cost, status, slipPayment FROM orders WHERE userId = ? AND id = ?',
        [parseInt(req.user.userId), parseInt(orderId)],
      )
      .then((data) => {
        return (getOrder = data[0]);
      });

    if (getOrder === undefined) {
      throw new NotFoundException('Data not found');
    }

    const getOrderItem = await this.orderItemRepository.query(
      'SELECT orderitems.id, services.title, services.description, serviceinfos.title, serviceinfos.content, serviceinfos.duration, serviceinfos.cost, services.image FROM orderitems INNER JOIN services ON orderitems.serviceId = services.id INNER JOIN serviceinfos ON orderitems.serviceInfoId = serviceinfos.id AND services.id = serviceinfos.serviceId WHERE orderitems.orderId = ?',
      [getOrder.id],
    );

    const mappingOrderItem = getOrderItem.map((item) => {
      const obj = {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        info: {
          title: item.title,
          content: item.content,
          duration: item.duration,
          cost: item.cost,
        },
      };

      return obj;
    });

    const objResult = {
      message: 'Fetch single order successfully',
      data: {
        id: getOrder.id,
        date: getOrder.date,
        cost: getOrder.cost,
        status: getOrder.status,
        slipPayment: getOrder.slipPayment,
        item: mappingOrderItem,
      },
    };

    return objResult;
  }

  async uploadSlip(req: any, file: any, orderId: string) {
    if (!file) {
      throw new BadRequestException('Please, upload a slip transfer');
    }

    let getOrder;

    await this.orderRepository
      .query(
        'SELECT id, date, cost, status, slipPayment, userId FROM orders WHERE id = ?',
        [parseInt(orderId)],
      )
      .then((data) => {
        return (getOrder = data[0]);
      });

    if (getOrder === undefined) {
      throw new NotFoundException('Data not found');
    }

    if (getOrder.userId !== parseInt(req.user.userId)) {
      throw new ForbiddenException('Forbidden to access');
    }

    const imageUrl = file.Location;

    await this.orderRepository.query(
      'UPDATE orders SET status = "Perlu konfirmasi", slipPayment = ? WHERE id = ?',
      [imageUrl, getOrder.id],
    );

    const objResult = {
      message: 'Upload slip transfer successfully',
      slip: imageUrl,
    };

    return objResult;
  }

  async getSellerOrders(req: any) {
    //* Get order id from orderItems where item creator logged user
    let orderId;

    orderId = await this.orderItemRepository.query(
      'SELECT orderitems.id, orderitems.orderId, orderitems.serviceId FROM orderitems INNER JOIN services ON orderitems.serviceId = services.id WHERE services.creator = ?',
      [parseInt(req.user.userId)],
    );

    if (orderId.length < 1) {
      orderId = [{ orderId: 0 }];
    }

    const arrOrderIds = orderId.map((order) => order.orderId);

    // console.log(arrOrderIds);

    const getSellerOrderData = await this.orderRepository.query(
      'SELECT orders.id, orders.date, orders.cost, orders.status, orders.cancelDate, orders.slipPayment, orders.isApprove, users.FULLNAME as buyer FROM orders INNER JOIN users ON orders.userId = users.USERID WHERE orders.id IN (?)',
      [arrOrderIds],
    );

    // console.log(getSellerOrderData);

    const objResult = {
      message: 'Get seller order successfully',
      data: getSellerOrderData,
      total: getSellerOrderData.length,
    };

    return objResult;
  }

  async doneOrder(req: any, orderId: string) {
    let getOrder;

    await this.orderRepository
      .query(
        'SELECT id, date, cost, status, slipPayment, isApprove, userId FROM orders WHERE id = ?',
        [parseInt(orderId)],
      )
      .then((data) => {
        return (getOrder = data[0]);
      });

    //! Handle any errors
    if (getOrder === undefined) {
      throw new NotFoundException('Data not found');
    }

    if (getOrder.userId !== parseInt(req.user.userId)) {
      throw new ForbiddenException('Forbidden to access');
    }

    if (getOrder.status != 'Pesanan aktif') {
      throw new BadRequestException(
        'Please, done an order which is already activated',
      );
    }

    if (getOrder.isApprove != 1) {
      throw new BadRequestException(
        'Please, done an order which is already approved by seller',
      );
    }

    const currentDate = new Date().toISOString();

    await this.orderRepository.query(
      'UPDATE orders SET status = "Selesai", doneDate = ? WHERE id = ?',
      [currentDate, parseInt(orderId)],
    );

    const objResult = { message: 'Orders successfully done' };

    return objResult;
  }
}
