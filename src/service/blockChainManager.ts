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
export const addBlock = (toBlockChain:blockChain, blockToAdd:block):blockChain => {
  toBlockChain.chain.push(blockToAdd);
  return toBlockChain;
};
export const createBlockChain = (miningReward:number, difficulty:number) : blockChain => (
  {
    chain: [createGenesisBlock()],
    transactions: [],
    miningReward,
    difficulty,
  });

export const getLastBlock = (blockchain:blockChain) : block => (
  blockchain.chain[blockchain.chain.length - 1]
);
export const findHash = (id:string, difficulty:number) => {
  let hash = sha256(id + Date.now());
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    hash = sha256(hash + Date.now());
  }
  return hash;
};
export const mine = (blockChainToMine:blockChain, userMiner:user):blockChain => {
  const LastBlock = getLastBlock(blockChainToMine);
  const dificulty = blockChainToMine.difficulty;
  let hash = sha256(LastBlock.id + Date.now());
  blockChainToMine.chain.map((bloc) => minePendingBuyOrSellTransaction(blockChainToMine, bloc));
  blockChainToMine.chain.map((bloc) => minePendingExchangeTransaction(blockChainToMine, bloc));
  while (hash.substring(0, dificulty) !== Array(dificulty + 1).join('0')) {
    hash = sha256(LastBlock.id + Date.now());
  }
  const Transaction :transaction = createTransaction(
    blockChainToMine.miningReward, null, userMiner, statusType.achieved,
  );
  const minedBlock = createBlock(LastBlock.id, hash);
  blockChainToMine.chain.push(minedBlock);
  blockChainToMine.transactions.push(Transaction);
  return blockChainToMine;
};

export const createBlockChainUser = (publicKey: string) : user => (
  { PrivateKey: sha256(publicKey), PublicKey: publicKey });
