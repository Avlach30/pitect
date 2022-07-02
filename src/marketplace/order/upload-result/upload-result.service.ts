import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orders } from '../../../entity/order.entity';
import { OrderItems } from '../../../entity/order-item.entity';

@Injectable()
export class UploadResultService {
  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    @InjectRepository(OrderItems)
    private orderItemRepository: Repository<Orders>,
  ) {}

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

    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString().split('T')[1];
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    const second = time.split(':')[2].split('.')[0];
    const currentDate = `${date} ${hour}:${minute}:${second}`;

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
}
