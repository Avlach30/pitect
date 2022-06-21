import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orders } from '../../entity/order.entity';
import { Withdrawals } from '../../entity/withdrawal.entity';
import { Banks } from '../../entity/bank.entity';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    @InjectRepository(Withdrawals)
    private withdrawalRepository: Repository<Withdrawals>,
    @InjectRepository(Banks) private bankRepository: Repository<Banks>,
  ) {}

  async getWithdrawals(req: any) {
    const finishedOrderCost = await this.orderRepository.query(
      'SELECT orders.id, orders.cost, orders.`status` FROM orders INNER JOIN orderitems ON orders.id = orderitems.orderId INNER JOIN services ON orderitems.serviceId = services.id WHERE orders.status = "Selesai" AND services.creator = ?',
      [parseInt(req.user.userId)],
    );

    const arrCostFinishedOrder = finishedOrderCost.map((order) => order.cost);

    const totalFinishedOrderBalance = arrCostFinishedOrder.reduce(
      (prevValue, currentValue) => prevValue + currentValue,
      0,
    );

    const withdrawals = await this.withdrawalRepository.query(
      'SELECT id, amount, status, slipTransfer FROM withdrawals WHERE userId = ?',
      [parseInt(req.user.userId)],
    );

    const successWithdrawalAmount = withdrawals
      .filter((withdrawal) => withdrawal.status == 'Selesai')
      .map((item) => item.amount)
      .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    const totalBalance = totalFinishedOrderBalance - successWithdrawalAmount;

    const objResult = {
      message: 'Get withdrawals data successfully',
      totalBalance: totalBalance,
      withdrawals: withdrawals,
    };

    return objResult;
  }

  async getBanks(req: any) {
    const userBanks = await this.bankRepository.query(
      'SELECT id, name, numberAccount FROM banks WHERE userId = ?',
      [parseInt(req.user.userId)],
    );

    userBanks.map((bank) => {
      bank.numberAccount = parseInt(bank.numberAccount);
      return bank;
    });

    const objResult = {
      message: 'Get banks data for withdrawal successfully',
      banks: userBanks,
    };

    return objResult;
  }

  async addBank(req: any, name: string, numberAccount: number) {
    if (!name || !numberAccount)
      throw new BadRequestException('Please input all fields');

    await this.bankRepository.query(
      'INSERT INTO banks (name, numberAccount, userId) VALUES (?, ?, ?)',
      [name, numberAccount, parseInt(req.user.userId)],
    );

    const objResult = {
      message: 'Add new bank account for withdrawal successfully',
      bank: {
        name,
        numberAccount,
      },
    };

    return objResult;
  }

  async withdrawalRequest(req: any, amount: number, bankId: string) {
    if (!amount || !bankId)
      throw new BadRequestException('Please input all fields');

    //* Logic for get total balance
    const finishedOrderCost = await this.orderRepository.query(
      'SELECT orders.id, orders.cost, orders.`status` FROM orders INNER JOIN orderitems ON orders.id = orderitems.orderId INNER JOIN services ON orderitems.serviceId = services.id WHERE orders.status = "Selesai" AND services.creator = ?',
      [parseInt(req.user.userId)],
    );

    const arrCostFinishedOrder = finishedOrderCost.map((order) => order.cost);

    const totalFinishedOrderBalance = arrCostFinishedOrder.reduce(
      (prevValue, currentValue) => prevValue + currentValue,
      0,
    );

    const withdrawals = await this.withdrawalRepository.query(
      'SELECT id, amount, status, slipTransfer FROM withdrawals WHERE userId = ?',
      [parseInt(req.user.userId)],
    );

    const successWithdrawalAmount = withdrawals
      .filter((withdrawal) => withdrawal.status == 'Selesai')
      .map((item) => item.amount)
      .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    const totalBalance = totalFinishedOrderBalance - successWithdrawalAmount;

    if (amount > totalBalance) {
      throw new BadRequestException(
        "Sorry, you can't request withdrawal with amount is more than your total balance",
      );
    }

    await this.withdrawalRepository.query(
      'INSERT INTO withdrawals (amount, userId, bankId, status) VALUES (?, ?, ?, "Pending")',
      [amount, parseInt(req.user.userId), parseInt(bankId)],
    );

    const objResult = {
      message: 'Request withdrawal successfully',
      amount,
    };

    return objResult;
  }
}
