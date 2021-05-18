/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import { SHA256 } from 'crypto-js';

export const sha256 = (str) => SHA256(str.toString()).toString();

export interface block {
  position: string;
  id: string;
  previousBlockId?: string;
}

export const createBlock = (_element: string, index: number): block => ((index > 0)
  ? { position: index.toString(), id: sha256(index), previousBlockId: sha256(index - 1) }
  : { position: index.toString(), id: sha256(0) });

export const createABlockChain = (arrayLength:number):block[] => new Array(arrayLength)
  .fill(0)
  .map(createBlock);

export const getLastBlock = (blockchain:block[]) => blockchain[blockchain.length - 1];

const validityOfABlockCondition = (_block: block, index: number, blockchain: block[]):boolean => ((index === 0) || blockchain[index].previousBlockId === blockchain[index - 1].id);

export const isValidFirstMethod = (blockchain:block[]) => (blockchain.filter(validityOfABlockCondition).length - blockchain.length) === 0;

export const isValid = (blockchain:block[]) : boolean => blockchain.reduce((acc, val, index, arr) => ((index === 0) ? true : (acc === (val.previousBlockId === arr[index - 1].id))), true);
