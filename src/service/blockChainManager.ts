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

export const getLastBlock = (blockchain) => blockchain[blockchain.length - 1];
