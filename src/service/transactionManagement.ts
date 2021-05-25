/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { block, blockChain } from '../model/block';
import { transaction, statusType } from '../model/transaction';
import { user } from '../model/user';

export const createTransaction = (amount:number, sender:user, receiver:user, status:statusType) => (
  {
    amount, sender, receiver, status,
  });
const removeTransaction = (array:transaction[], element:transaction) => (array.filter((tr) => (tr !== element)));

export const getBalance = (BlockChain:blockChain, User:user) : number => {
  let result = 0;
  for (const tr of BlockChain.transactions) {
    if (tr.receiver === User) {
      result += tr.amount;
    }
    if (tr.sender === User) {
      result -= tr.amount;
    }
  }
  return result;
};

const isTransactionValid = (BlockChain:blockChain, Transaction:transaction):boolean => {
  if (Transaction.amount <= 0) {
    return false;
  }
  if (getBalance(BlockChain, Transaction.sender) < Transaction.amount) {
    return false;
  }
  return true;
};
export const minePendingExchangeTransaction = (BlockChain:blockChain, Block : block) : block => {
  const newPendingTransactions = Block.pendingTransactions.filter((Transaction) => (isTransactionValid(BlockChain, Transaction)));
  newPendingTransactions.forEach((Tr) => {
    console.log(`${Tr.sender.privateKey} has transferred ${Tr.amount} to ${Tr.receiver.privateKey}`);
    return BlockChain.transactions.push(createTransaction(Tr.amount, Tr.sender, Tr.receiver, statusType.achieved));
  });
  Block.pendingTransactions = Block.pendingTransactions.filter((Tr) => ((!newPendingTransactions.includes(Tr)) || (Tr.sender === null || Tr.receiver === null)));
  return Block;
};
const findMatchingTransaction = (BlockChain:blockChain, Block : block, Transaction :transaction) :transaction => {
  if (Transaction.sender === null) {
    return Block.pendingTransactions.find((Tr) => (Tr.amount === Transaction.amount && Tr.receiver === null));
  }
  if (Transaction.receiver === null) {
    return Block.pendingTransactions.find((Tr) => (Tr.amount === Transaction.amount && Tr.sender === null));
  }
  return undefined;
};
export const minePendingBuyOrSellTransaction = (BlockChain:blockChain, Block : block) : block => {
  const filteredBlockPendingTransactionArray = Block.pendingTransactions.filter(
    (tr) => ((tr.sender === null || tr.receiver)
      && (findMatchingTransaction(BlockChain, Block, tr) !== undefined || findMatchingTransaction(BlockChain, Block, tr) !== null)),
  );
  for (const Transaction of filteredBlockPendingTransactionArray) {
    const Match = findMatchingTransaction(BlockChain, Block, Transaction);
    if (Transaction.sender === null) {
      console.log(`${Match.sender.privateKey} has transferred ${Match.amount} to ${Transaction.receiver.privateKey}`);
      BlockChain.transactions.push(createTransaction(Match.amount, Match.sender, Transaction.receiver, statusType.achieved));
      Block.pendingTransactions = removeTransaction(Block.pendingTransactions, Transaction);
      Block.pendingTransactions = removeTransaction(Block.pendingTransactions, Match);
    }
    if (Transaction.receiver === null) {
      console.log(`${Transaction.sender.privateKey} has transferred ${Match.amount} to ${Match.receiver}`);
      BlockChain.transactions.push(createTransaction(Match.amount, Transaction.sender, Match.receiver, statusType.achieved));
      Block.pendingTransactions = removeTransaction(Block.pendingTransactions, Transaction);
      Block.pendingTransactions = removeTransaction(Block.pendingTransactions, Match);
    }
  }
  return Block;
};
