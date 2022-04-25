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
import { Services } from '../../entity/services.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Services) private serviceRepository: Repository<Services>,
    @InjectRepository(Carts)
    private cartRepository: Repository<Carts>,
    @InjectRepository(CartItems)
    private cartItemRepository: Repository<CartItems>,
  ) {}

  async addToCart(
    @Request() req: any,
    catalogId: string,
    catalogItemId: number,
  ) {
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

    //* Check if logged user have a cart data or not
    const cart = await this.cartRepository.query(
      'SELECT id, userId FROM carts WHERE userId = ?',
      [parseInt(req.user.userId)],
    );

    if (cart.length < 1) {
      const createCart = await this.cartRepository.query(
        'INSERT INTO carts (userId) VALUES (?)',
        [parseInt(req.user.userId)],
      );
      await this.cartItemRepository.query(
        'INSERT INTO cartitems (serviceId, serviceInfoId, cartId) VALUES (?, ?, ?)',
        [parseInt(catalogId), catalogItemId, createCart.insertId],
      );
    } else {
      //* Insert catalog to cartitems
      await this.cartItemRepository.query(
        'INSERT INTO cartitems (serviceId, serviceInfoId, cartId) VALUES (?, ?, ?)',
        [catalogId, catalogItemId, cart[0].id],
      );
    }

    const objResult = {
      message: 'Insert to cart successfully',
      data: {
        catalog: result.title,
      },
    };

    return objResult;
  }

  async getCarts(req: any) {
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
      'SELECT cartitems.id, services.title AS catalog, serviceinfos.title AS catalogInfo, serviceinfos.content AS catalogContent, serviceinfos.duration AS catalogDuration, serviceinfos.cost AS catalogCost FROM cartitems INNER JOIN services ON cartitems.serviceId = services.id INNER JOIN serviceinfos ON cartitems.serviceInfoId = serviceinfos.id AND services.id = serviceinfos.serviceId WHERE cartitems.cartId = ?',
      [result.id],
    );

    //* Get current date and add dynamic days to get finish date
    const durationInfo = (days: number) => {
      const currentDate = new Date().toISOString();

      const finishDate = new Date(
        Date.now() + days * (24 * 60 * 60 * 1000),
      ).toISOString();

      //* Compare date for define a status
      const status = finishDate < currentDate ? 'Finish' : 'On Going';

      const result = {
        current: currentDate,
        finishDate: finishDate,
        status,
      };

      return result;
    };

    //* Calculate total of cart item cost
    const sumCost = cartItem
      .map((item) => item.catalogCost)
      .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    //* Mapping each of item in cart
    const mappingCartItem = cartItem.map((item) => {
      const obj = {
        cartItemId: item.id,
        catalog: item.catalog,
        catalogInfo: {
          title: item.catalogInfo,
          content: item.catalogContent,
          duration: item.catalogDuration,
          cost: item.catalogCost,
        },
        date: durationInfo(item.catalogDuration),
      };

      return obj;
    });

    const objResult = {
      message: 'Fetch carts successfully',
      data: mappingCartItem,
      totalCost: sumCost,
    };

    return objResult;
  }

  async deleteFromCart(req: any, cartItemId: string) {
    let getCart;
    let getCartItem;

    await this.cartRepository
      .query('SELECT id, userId FROM carts WHERE userId = ?', [
        parseInt(req.user.userId),
      ])
      .then((data) => {
        getCart = data[0];
        return getCart;
      });

    await this.cartItemRepository
      .query('SELECT id FROM cartitems WHERE id = ?', [parseInt(cartItemId)])
      .then((data) => (getCartItem = data[0]));

    // console.log(getCart);

    if (getCart == undefined || getCartItem == undefined) {
      throw new NotFoundException('Data not found');
    }

    const deleteQuery = await this.cartItemRepository.query(
      'DELETE FROM cartitems WHERE id =? AND cartId = ?',
      [parseInt(cartItemId), getCart.id],
    );

    const objResult = {
      message: '',
      status: '',
    };

    if (deleteQuery.affectedRows == 0) {
      //* If deleted item still in database (can't delete)
      objResult.message = 'Delete item from cart failed';
      objResult.status = 'Failed';
    } else {
      objResult.message = 'Delete item from cart successfully';
      objResult.status = 'Successful';
    }

    return objResult;
  }
}
