/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */

import { block, blockChain } from '../model/block';
import { transaction, statusType } from '../model/transaction';
import { user } from '../model/user';

export const createTransaction = (amount:number, sender:user, receiver:user, status:statusType) => (
  {
    amount, sender, receiver, status,
  });

export const getBalance = (blockchainTargeted:blockChain, userTargeted:user) : number => (
  blockchainTargeted.transactions
    .filter((transactionToFilter) => (
      transactionToFilter.sender?.PrivateKey === userTargeted.PrivateKey
      || transactionToFilter.receiver?.PrivateKey === userTargeted.PrivateKey))
    .reduce(((accumulator, currentTransaction) => (
      (currentTransaction.receiver?.PrivateKey === userTargeted.PrivateKey)
        ? (accumulator + currentTransaction.amount)
        : (accumulator - currentTransaction.amount))), 0));

export const minePendingExchangeTransaction = (
  blockChainTargeted:blockChain, blockToMine : block,
) : block => {
  blockToMine.pendingTransactions.filter(
    (transactionToFilter) => (transactionToFilter.sender && transactionToFilter.receiver
    && transactionToFilter.amount > 0
    && transactionToFilter.amount <= getBalance(blockChainTargeted, transactionToFilter.sender)),
  )
    .forEach((transactionTargeted) => {
      blockChainTargeted.transactions.push(createTransaction(transactionTargeted.amount,
        transactionTargeted.sender, transactionTargeted.receiver, statusType.achieved));
      blockToMine.pendingTransactions = blockToMine.pendingTransactions
        .filter((transactionToFilter) => transactionToFilter !== transactionTargeted);
    });
  return blockToMine;
};

const findMatchingTransaction = (blockTargeted : block,
  transactionTargeted :transaction) :transaction => {
  if (!transactionTargeted.sender) {
    return blockTargeted.pendingTransactions.find((transactionToFind) => (
      transactionToFind.amount === transactionTargeted.amount && !transactionToFind.receiver));
  }
  if (!transactionTargeted.receiver) {
    return blockTargeted.pendingTransactions.find((transactionToFind) => (
      transactionToFind.amount === transactionTargeted.amount && !transactionToFind.sender));
  }
  return undefined;
};

export const minePendingBuyOrSellTransaction = (
  blockChainToMine:blockChain, blockTargeted : block,
) : block => {
  for (const Transaction of blockTargeted.pendingTransactions) {
    const Match = findMatchingTransaction(blockTargeted, Transaction);
    if (!Transaction.receiver && Match) {
      blockChainToMine.transactions.push(createTransaction(Match.amount,
        Transaction.sender, Match.receiver, statusType.achieved));
      blockTargeted.pendingTransactions = blockTargeted.pendingTransactions
        .filter((transactionToSuppress) => (
          Transaction !== transactionToSuppress && Match !== transactionToSuppress));
    } else if (!Transaction.sender && Match) {
      blockChainToMine.transactions
        .push(createTransaction(Match.amount,
          Match.sender, Transaction.receiver, statusType.achieved));
      blockTargeted.pendingTransactions = blockTargeted
        .pendingTransactions.filter((transactionToSuppress) => (
          Transaction !== transactionToSuppress && Match !== transactionToSuppress));
    }
  }
  return blockTargeted;
};
const getAllSucceededTransactionsByUser = (
  blockchain:blockChain, userTargeted:user,
) :transaction[] => blockchain
  .transactions
  .filter(
    (transactionSucceeded:transaction) => (
      (transactionSucceeded.sender
        && transactionSucceeded.sender.PrivateKey === userTargeted.PrivateKey)
      || (transactionSucceeded.receiver
        && transactionSucceeded.receiver.PrivateKey === userTargeted.PrivateKey)),
  );
const getAllPendingTransactionsByUserForABlock = (
  blockTargeted:block, userTargeted:user,
):transaction[] => blockTargeted
  .pendingTransactions
  .filter(
    (pendingTransaction:transaction) => (
      (pendingTransaction.receiver
        && pendingTransaction.receiver.PrivateKey === userTargeted.PrivateKey)
      || (pendingTransaction.sender
        && pendingTransaction.sender.PrivateKey === userTargeted.PrivateKey)
    ),
  );
export const getAllTransactionsByUser = (
  blockchain:blockChain, userTargeted:user,
) :transaction[] => blockchain.chain
  .filter(
    (bloc: block) => getAllPendingTransactionsByUserForABlock(bloc, userTargeted).length > 0,
  )
  .reduce(
    (accumulator, currentBlock) => accumulator
      .concat(getAllPendingTransactionsByUserForABlock(currentBlock, userTargeted)), [],
  )
  .concat(
    getAllSucceededTransactionsByUser(blockchain, userTargeted),
  );
