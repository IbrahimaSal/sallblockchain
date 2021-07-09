import { SHA256 } from 'crypto-js';
import { block, blockChain } from '../model/block';
import { statusType, transaction } from '../model/transaction';
import { user } from '../model/user';
import { createTransaction, minePendingBuyOrSellTransaction, minePendingExchangeTransaction } from './transactionManagement';

export const sha256 = (str) => (SHA256(str.toString()).toString());

export const createGenesisBlock = () : block => (
  { id: sha256(Date.now()), pendingTransactions: [] });

export const createBlock = (previousId:string, id:string): block => (
  (previousId === null)
    ? { id, pendingTransactions: [] }
    : { previousId, id, pendingTransactions: [] }
);
export const addBlock = (ToBlockChain:blockChain, Block:block):blockChain => {
  ToBlockChain.chain.push(Block);
  return ToBlockChain;
};
export const createBlockChain = (miningReward:number, difficulty:number) : blockChain => (
  {
    chain: [createGenesisBlock()],
    transactions: [],
    miningReward,
    difficulty,
  });

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
  const Transaction :transaction = createTransaction(
    BlockChain.miningReward, null, userMiner, statusType.achieved,
  );
  const minedBlock = createBlock(LastBlock.id, hash);
  BlockChain.chain.push(minedBlock);
  BlockChain.transactions.push(Transaction);
  return BlockChain;
};

export const createBlockChainUser = (publicKey: string) : user => (
  { privateKey: sha256(publicKey), publicKey });
