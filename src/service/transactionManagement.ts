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
// const removeTransaction = (array:transaction[], element:transaction) => (array.filter((tr) => (tr !== element)));

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

const isTransactionValid = (BlockChain:blockChain, Transaction:transaction):boolean => !(
  (Transaction.amount <= 0) || (getBalance(BlockChain, Transaction.sender) < Transaction.amount));

export const minePendingExchangeTransaction = (BlockChain:blockChain, Block : block) : block => {
  const newPendingTransactions = Block.pendingTransactions.filter((Transaction) => (isTransactionValid(BlockChain, Transaction)));
  newPendingTransactions.forEach((Transaction) => {
    console.log(`${Transaction.sender.privateKey} has transferred ${Transaction.amount} to ${Transaction.receiver.privateKey}`);
    return BlockChain.transactions.push(createTransaction(Transaction.amount, Transaction.sender, Transaction.receiver, statusType.achieved));
  });
  Block.pendingTransactions = Block.pendingTransactions.filter(
    (Transaction) => ((!newPendingTransactions.includes(Transaction))
    || (Transaction.sender === null || Transaction.receiver === null)),
  );
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
/* export const minePendingBuyOrSellTransaction = (BlockChain:blockChain, Block : block) : block => {
  const filteredBlockPendingTransactionArray = Block.pendingTransactions.filter(
    (tr) => ((tr.sender === null || tr.receiver)
      && (findMatchingTransaction(BlockChain, Block, tr) !== undefined
      || findMatchingTransaction(BlockChain, Block, tr) !== null)),
  );
  console.log(filteredBlockPendingTransactionArray);
  for (const Transaction of filteredBlockPendingTransactionArray) {
    const Match = findMatchingTransaction(BlockChain, Block, Transaction);
    if (Transaction.sender === null) {
      console.log(`${Match.sender.privateKey} has transferred ${Match.amount} to ${Transaction.receiver.privateKey}`);
      BlockChain.transactions.push(createTransaction(Match.amount, Match.sender, Transaction.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions.filter((transactionA) => (Transaction !== transactionA && Match !== transactionA));
    }
    if (Transaction.receiver === null) {
      console.log(`${Transaction.sender.privateKey} has transferred ${Match.amount} to ${Match.receiver}`);
      BlockChain.transactions.push(createTransaction(Match.amount, Transaction.sender, Match.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions.filter((transactionA) => (Transaction !== transactionA && Match !== transactionA));
    }
  }
  return Block;
}; */
export const minePendingBuyOrSellTransaction = (BlockChain:blockChain, Block : block) : block => {
  for (const Transaction of Block.pendingTransactions) {
    const Match = findMatchingTransaction(BlockChain, Block, Transaction);
    if (Transaction.receiver === null && Match !== null && Match !== undefined) {
      console.log(`${Transaction.sender.privateKey} has transferred ${Match.amount} to ${Match.receiver.privateKey}`);
      BlockChain.transactions.push(createTransaction(Match.amount, Transaction.sender, Match.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions.filter((transactionA) => (Transaction !== transactionA && Match !== transactionA));
    } else if (Transaction.sender === null && Match !== null && Match !== undefined) {
      console.log(`${Match.sender.privateKey} has transferred ${Match.amount} to ${Transaction.receiver.privateKey}`);
      BlockChain.transactions.push(createTransaction(Match.amount, Match.sender, Transaction.receiver, statusType.achieved));
      Block.pendingTransactions = Block.pendingTransactions.filter((transactionA) => (Transaction !== transactionA && Match !== transactionA));
    }
  }
  console.log(Block);
  return Block;
};

// export const minePendingBuyOrSellTransaction = (BlockChain:blockChain, Block : block) : block => {
//   Block.pendingTransactions
//     .filter((transaction) => findMatchingTransaction(BlockChain, Block, transaction))
//     .forEach((transaction) => {
//       console.log(`${transaction.sender.privateKey} has transferred ${matchingTransaction.amount} to ${matchingTransaction.receiver.privateKey}`);
//       transaction.sender ?
//         BlockChain.transactions.push(createTransaction(matchingTransaction.amount, transaction.sender, matchingTransaction.receiver, statusType.achieved)) : 
//         BlockChain.transactions.push(createTransaction(matchingTransaction.amount, matchingTransaction.sender, transaction.receiver, statusType.achieved));
//       Block.pendingTransactions = Block.pendingTransactions.filter((transactionA) => (transaction !== transactionA && matchingTransaction !== transactionA));
//     });

//   return Block;
// };
