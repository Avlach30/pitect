import {
  Injectable,
  BadRequestException,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orders } from '../../entity/order.entity';
import { OrderItems } from '../../entity/order-item.entity';
import { OrderReviews } from 'src/entity/order-review.entity';
import { Services } from '../../entity/services.entity';
import { Users } from '../../entity/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    @InjectRepository(OrderItems)
    private orderItemRepository: Repository<Orders>,
    @InjectRepository(OrderReviews)
    private reviewRepository: Repository<OrderReviews>,
    @InjectRepository(Services) private serviceRepository: Repository<Services>,
    @InjectRepository(Services)
    private serviceInfoRepository: Repository<Services>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async createOrder(req: any, catalogId: string, catalogItemId: number) {
    let result;

    if (!catalogItemId) {
      throw new BadRequestException('Please, choose a variation firstly');
    }

    await this.serviceRepository
      .query('SELECT id, title FROM services WHERE services.id = ?', [
        parseInt(catalogId),
      ])
      .then((data) => {
        result = data[0];
        return result;
      });

    // console.log(result);

    if (result == undefined) {
      throw new NotFoundException('Data not found');
    }

    const serviceItem = await this.serviceInfoRepository.query(
      'SELECT cost, duration FROM serviceinfos WHERE id = ? AND serviceId = ?',
      [catalogItemId, parseInt(catalogId)],
    );

    const currentDate: any = new Date();
    const doneDate: any = new Date(
      Date.now() + 3600 * 1000 * 24 * parseInt(serviceItem[0].duration),
    );

    const insertOrder = await this.orderRepository.query(
      'INSERT INTO orders (date, cost, userId, doneDate) VALUES (?, ?, ?, ?)',
      [currentDate, serviceItem[0].cost, parseInt(req.user.userId), doneDate],
    );

    await this.orderItemRepository.query(
      'INSERT INTO orderitems (orderId, serviceId, serviceInfoId) VALUES (?, ?, ?)',
      [insertOrder.insertId, parseInt(catalogId), catalogItemId],
    );

    const objResult = {
      message: 'Create new order successfully',
      cost: serviceItem[0].cost,
      orderDate: currentDate,
      estimateDoneDate: doneDate,
    };

    return objResult;
  }

  async getOrders(req: any) {
    const orders = await this.orderRepository.query(
      'SELECT orders.id, orders.cost, orders.`status`, orders.date AS orderDate, orders.cancelDate AS cancelDate, orders.doneDate AS doneDate, services.title, services.creator AS seller, serviceinfos.title AS variation, services.image FROM orders INNER JOIN orderitems ON orders.id = orderitems.orderId INNER JOIN services ON orderitems.serviceId = services.id INNER JOIN serviceinfos ON orderitems.serviceInfoId = serviceinfos.id AND services.id = serviceinfos.serviceId WHERE orders.userId = ?',
      [parseInt(req.user.userId)],
    );

    const getSellerId = orders.map((order) => order.seller);

    const sellers = await this.userRepository.query(
      'SELECT USERID, FULLNAME FROM users WHERE USERID IN (?)',
      [getSellerId],
    );

    const mergedOrders = orders.map((order) => ({
      ...order,
      ...sellers.find((seller) => seller.USERID === order.seller),
    }));

    const mappingOrders = mergedOrders.map((order) => {
      const obj = {
        id: order.id,
        order: {
          title: order.title,
          image: order.image,
          cost: order.cost,
          status: order.status,
          variation: order.variation,
          seller: order.FULLNAME,
        },
        dates: {
          order: order.orderDate,
          done: order.doneDate,
          cancel: order.cancelDate,
        },
      };
      return obj;
    });

    const needVerificationOrders = mappingOrders.filter(
      (order) => order.order.status == 'Belum bayar',
    );

    const pendingOrders = mappingOrders.filter(
      (order) => order.order.status == 'Perlu konfirmasi',
    );

    const activeOrders = mappingOrders.filter(
      (order) => order.order.status == 'Pesanan aktif',
    );

    const doneOrders = mappingOrders.filter(
      (order) => order.order.status == 'Selesai',
    );

    const cancelOrders = mappingOrders.filter(
      (order) => order.order.status == 'Canceled',
    );

    const objResult = {
      message: 'Get orders successfully',
      orders: {
        all: mappingOrders,
        needVerification: needVerificationOrders,
        pending: pendingOrders,
        active: activeOrders,
        done: doneOrders,
        canceled: cancelOrders,
      },
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
      'SELECT orderitems.id, services.id AS serviceId, services.title, services.description, serviceinfos.title AS variation, serviceinfos.content, serviceinfos.duration, serviceinfos.cost, services.image FROM orderitems INNER JOIN services ON orderitems.serviceId = services.id INNER JOIN serviceinfos ON orderitems.serviceInfoId = serviceinfos.id AND services.id = serviceinfos.serviceId WHERE orderitems.orderId = ?',
      [getOrder.id],
    );

    const mappingOrderItem = getOrderItem.map((item) => {
      const obj = {
        id: item.serviceId,
        title: item.title,
        description: item.description,
        image: item.image,
        info: {
          variation: item.variation,
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

    if (getOrder.status == 'Canceled')
      throw new BadRequestException(
        'Sorry, you cant verification the order which is rejected by seller',
      );

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
    const orders = await this.orderItemRepository.query(
      'SELECT orders.id, orders.cost, orders.`status`, orders.date AS orderDate, orders.userId AS buyer, orders.cancelDate AS cancelDate, orders.doneDate AS doneDate, services.title, serviceinfos.title AS variation, services.image FROM orders INNER JOIN orderitems ON orders.id = orderitems.orderId INNER JOIN services ON orderitems.serviceId = services.id INNER JOIN serviceinfos ON orderitems.serviceInfoId = serviceinfos.id AND services.id = serviceinfos.serviceId WHERE services.creator = ?',
      [parseInt(req.user.userId)],
    );

    const getBuyerId = orders.map((order) => order.buyer);

    const buyers = await this.userRepository.query(
      'SELECT USERID, FULLNAME FROM users WHERE USERID IN (?)',
      [getBuyerId],
    );

    const mergedOrders = orders.map((order) => ({
      ...order,
      ...buyers.find((buyer) => buyer.USERID === order.buyer),
    }));

    const mappingOrders = mergedOrders.map((order) => {
      const obj = {
        id: order.id,
        order: {
          title: order.title,
          image: order.image,
          cost: order.cost,
          status: order.status,
          variation: order.variation,
          buyer: order.FULLNAME,
        },
        dates: {
          order: order.orderDate,
          done: order.doneDate,
          cancel: order.cancelDate,
        },
      };
      return obj;
    });

    const needVerificationOrders = mappingOrders.filter(
      (order) => order.order.status == 'Belum bayar',
    );

    const pendingOrders = mappingOrders.filter(
      (order) => order.order.status == 'Perlu konfirmasi',
    );

    const activeOrders = mappingOrders.filter(
      (order) => order.order.status == 'Pesanan aktif',
    );

    const doneOrders = mappingOrders.filter(
      (order) => order.order.status == 'Selesai',
    );

    const cancelOrders = mappingOrders.filter(
      (order) => order.order.status == 'Canceled',
    );

    const objResult = {
      message: 'Get orders for seller successfully',
      orders: {
        all: mappingOrders,
        needVerification: needVerificationOrders,
        pending: pendingOrders,
        active: activeOrders,
        done: doneOrders,
        canceled: cancelOrders,
      },
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

  async rejectOrder(orderId: string, req: any) {
    let order;

    await this.orderItemRepository
      .query(
        'SELECT orderitems.id, orderitems.orderId, orderitems.serviceId, services.creator FROM orderitems INNER JOIN services ON orderitems.serviceId = services.id WHERE services.creator = ? AND orderitems.orderId = ?',
        [parseInt(req.user.userId), parseInt(orderId)],
      )
      .then((data) => {
        order = data[0];
        return order;
      });

    if (order == undefined) {
      throw new NotFoundException('Data not found');
    }

    const currentDate = new Date().toISOString();

    await this.orderRepository.query(
      'UPDATE orders SET isApprove = ?, status = ?, cancelDate = ? WHERE id = ?',
      [0, 'Canceled', currentDate, parseInt(orderId)],
    );

    const objResult = { message: 'Order rejected by seller' };

    return objResult;
  }

  async uploadResult(req: any, file: any, orderId: string) {
    let getOrder;
    let getCreator;

    if (!file) {
      throw new BadRequestException(
        'Please, you must upload a file result of your services',
      );
    }

    //* Get order id
    await this.orderRepository
      .query('SELECT id, status FROM orders WHERE id = ?', [parseInt(orderId)])
      .then((data) => {
        return (getOrder = data[0]);
      });

    if (getOrder === undefined) {
      throw new NotFoundException('Data not found');
    }

    if (getOrder.status != 'Pesanan aktif') {
      throw new BadRequestException(
        'Please, upload an order result which is already activated',
      );
    }

    await this.orderItemRepository
      .query(
        'SELECT orderitems.id, orderitems.orderId, services.creator AS seller FROM orderitems INNER JOIN services ON orderitems.serviceId = services.id WHERE orderitems.orderId = ?',
        [parseInt(getOrder.id)],
      )
      .then((data) => (getCreator = data[0]));

    if (getCreator.seller != parseInt(req.user.userId)) {
      throw new ForbiddenException('Forbidden to access');
    }

    const serviceResult = file.Location;

    const currentDate = new Date().toISOString();

    await this.orderRepository.query(
      'UPDATE orders SET status = "Selesai", doneDate = ?, serviceResult = ? WHERE id = ?',
      [currentDate, serviceResult, parseInt(getOrder.id)],
    );

    const objResult = {
      message: 'Uploading order result by seller successfully',
      result: serviceResult,
    };
    return objResult;
  }

  async createReview(
    orderId: string,
    serviceId: string,
    req: any,
    comment: string,
    rating: number,
  ) {
    let getOrder;

    await this.orderRepository
      .query('SELECT id, status FROM orders WHERE userId = ? AND id = ?', [
        parseInt(req.user.userId),
        parseInt(orderId),
      ])
      .then((data) => {
        return (getOrder = data[0]);
      });

    if (getOrder === undefined) {
      throw new NotFoundException('Data not found');
    }

    const getOrderItem = await this.orderItemRepository.query(
      'SELECT id, serviceId, orderId FROM orderitems WHERE orderId = ? AND serviceId = ?',
      [parseInt(orderId), parseInt(serviceId)],
    );

    if (getOrderItem.length < 1) {
      throw new NotFoundException('Data not found');
    }

    if (getOrder.status != 'Selesai') {
      throw new BadRequestException(
        'Please, give a review and comment to order which is already done',
      );
    }

    await this.reviewRepository.query(
      'INSERT INTO orderreviews (comment, rating, orderId, serviceId, reviewer) VALUES (?, ?, ?, ?, ?)',
      [
        comment,
        rating,
        parseInt(orderId),
        parseInt(serviceId),
        parseInt(req.user.userId),
      ],
    );

    const objResult = {
      message: 'Successfully insert new reviews',
      rating: rating,
      comment: comment,
      reviewer: req.user.name,
    };

    return objResult;
  }
}
