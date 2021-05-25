/* eslint-disable no-console */
/* eslint-disable max-len */
import { SHA256 } from 'crypto-js';
import { block, blockChain } from '../model/block';
import { statusType, transaction } from '../model/transaction';
import { user } from '../model/user';
import { createTransaction, minePendingBuyOrSellTransaction, minePendingExchangeTransaction } from './transactionManagement';

export const sha256 = (str) => (SHA256(str.toString()).toString());

export const createGenesisBlock = () : block => ({ id: sha256(Date.now()), pendingTransactions: [] });

export const createBlock = (previousId:string, id:string, pendingTransactions:transaction[]): block => (
  (previousId === null) ? { id, pendingTransactions } : { previousId, id, pendingTransactions }
);

export const createBlockChain = (miningReward:number, difficulty:number, rootUser:user) : blockChain => (
  {
    chain: [createGenesisBlock()],
    transactions: [],
    miningReward,
    difficulty,
    rootUser,
  });
export const addBlock = (ToBlockChain:blockChain, Block:block):blockChain => {
  ToBlockChain.chain.push(Block);
  return ToBlockChain;
};
export const getLastBlock = (BlockChain:blockChain) : block => (
  BlockChain.chain[BlockChain.chain.length - 1]
);
export const findHash = (id:string, difficulty:number) => {
  let hash = sha256(id + Date.now());
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    hash = sha256(hash + Date.now());
  }
  return hash;
};
export const mine = (BlockChain:blockChain, userMiner:user):blockChain => {
  const LastBlock = getLastBlock(BlockChain);
  const dificulty = BlockChain.difficulty;
  let hash = sha256(LastBlock.id + Date.now());
  BlockChain.chain.map((blc) => minePendingBuyOrSellTransaction(BlockChain, blc));
  BlockChain.chain.map((blc) => minePendingExchangeTransaction(BlockChain, blc));
  while (hash.substring(0, dificulty) !== Array(dificulty + 1).join('0')) {
    hash = sha256(LastBlock.id + Date.now());
  }
  console.log(`********* a new bloc with id: ${hash} just got mined by ${userMiner.privateKey}*********`);
  const Transaction :transaction = createTransaction(
    BlockChain.miningReward, BlockChain.rootUser, userMiner, statusType.achieved,
  );
  const minedBlock = createBlock(LastBlock.id, hash, []);
  BlockChain.chain.push(minedBlock);
  BlockChain.transactions.push(Transaction);
  return BlockChain;
};
