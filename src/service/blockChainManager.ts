/* eslint-disable no-console */
import { SHA256 } from 'crypto-js';
import { block } from '../model/block';

export const sha256 = (str) => SHA256(str.toString()).toString();

export const createBlock = (_element: string, index: number): block => ((index > 0)
  ? { position: index.toString(), id: sha256(index), previousBlockId: sha256(index - 1) }
  : { position: index.toString(), id: sha256(0) });

export const createABlockChain = (arrayLength:number):block[] => new Array(arrayLength)
  .fill(0)
  .map(createBlock);

export const getLastBlock = (blockchain:block[]): block => blockchain[blockchain.length - 1];

const invalidBlock = (_block: block, index: number, blockchain: block[]):boolean => (
  (index !== 0) && blockchain[index].previousBlockId !== blockchain[index - 1].id);

export const isThisBlockChainValid = (blockchain:block[]) => (
  blockchain.find(invalidBlock) === undefined);

export const mine = (bloc:block, difficulty:number) : block => {
  let hash = sha256(bloc.position + bloc.id + Date.now());
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    hash = sha256(bloc.position + bloc.id + Date.now());
  }
  console.log(`a new bloc with id: ${hash} just got mined`);
  return { position: bloc.position + 1, id: hash, previousBlockId: bloc.id };
};

export const addABlockToBlockChain = (blockchain:block[]) :block[] => (
  [...blockchain, mine(getLastBlock(blockchain), 2)]);
