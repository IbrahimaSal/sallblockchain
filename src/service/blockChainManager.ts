import { SHA256 } from 'crypto-js';
import { Block } from '../model/block';

export const sha256 = (str) => SHA256(str.toString()).toString();

export const createBlock = (_element: string, index: number): Block => ((index > 0)
  ? { position: index.toString(), id: sha256(index), previousBlockId: sha256(index - 1) }
  : { position: index.toString(), id: sha256(0) });

export const createABlockChain = (arrayLength:number):Block[] => new Array(arrayLength)
  .fill(0)
  .map(createBlock);

export const getLastBlock = (blockchain:Block[]): Block => blockchain[blockchain.length - 1];

const invalidBlock = (_block: Block, index: number, blockchain: Block[]):boolean => (
  (index !== 0) && blockchain[index].previousBlockId !== blockchain[index - 1].id);

export const isThisBlockChainValid = (blockchain:Block[]) => (
  blockchain.find(invalidBlock) === undefined);

export const mine = (bloc:Block, difficulty:number) : Block => {
  let hash = sha256(bloc.position + bloc.id + Date.now());
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    hash = sha256(bloc.position + bloc.id + Date.now());
  }
  console.log(`a new bloc with id: ${hash} just got mined`);
  return { position: bloc.position + 1, id: hash, previousBlockId: bloc.id };
};

export const addAblockToBlockChain = (blockchain:Block[]) :Block[] => (
  [...blockchain, mine(getLastBlock(blockchain), 2)]);
