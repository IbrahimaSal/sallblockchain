/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */

import { block, blockChain } from '../model/block';
import { transaction, statusType } from '../model/transaction';
import { user } from '../model/user';

export const createTransaction = (amount:number, sender:user, receiver:user, status:statusType) => (
  {
    amount, sender, receiver, status,
  });

export const getBalance = (BlockChain:blockChain, User:user) : number => (
  BlockChain.transactions
    .filter((Transaction) => (Transaction.sender === User || Transaction.receiver === User))
    .reduce(((accumulator, Transaction) => ((Transaction.receiver === User)
      ? (accumulator + Transaction.amount)
      : (accumulator - Transaction.amount))), 0));

export const minePendingExchangeTransaction = (BlockChain:blockChain, Block : block) : block => {
  Block.pendingTransactions.filter((Transaction) => (Transaction.sender && Transaction.receiver
    && Transaction.amount > 0 && Transaction.amount <= getBalance(BlockChain, Transaction.sender)))
    .forEach((Transaction) => {
      BlockChain.transactions.push(createTransaction(Transaction.amount,
        Transaction.sender, Transaction.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions
        .filter((TransacTion) => TransacTion !== Transaction);
    });
  return Block;
};

const findMatchingTransaction = (BlockChain:blockChain, Block : block,
  Transaction :transaction) :transaction => {
  if (!Transaction.sender) {
    return Block.pendingTransactions.find((TransactionToFind) => (
      TransactionToFind.amount === Transaction.amount && !TransactionToFind.receiver));
  }
  if (!Transaction.receiver) {
    return Block.pendingTransactions.find((TransactionToFind) => (
      TransactionToFind.amount === Transaction.amount && !TransactionToFind.sender));
  }
  return undefined;
};

export const minePendingBuyOrSellTransaction = (BlockChain:blockChain, Block : block) : block => {
  for (const Transaction of Block.pendingTransactions) {
    const Match = findMatchingTransaction(BlockChain, Block, Transaction);
    if (!Transaction.receiver && Match) {
      BlockChain.transactions.push(createTransaction(Match.amount,
        Transaction.sender, Match.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions.filter((transactionToSuppress) => (
        Transaction !== transactionToSuppress && Match !== transactionToSuppress));
    } else if (!Transaction.sender && Match) {
      BlockChain.transactions
        .push(createTransaction(Match.amount,
          Match.sender, Transaction.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions.filter((transactionToSuppress) => (
        Transaction !== transactionToSuppress && Match !== transactionToSuppress));
    }
  }
  return Block;
};
