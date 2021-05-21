/* eslint-disable no-restricted-syntax */
import { sha256 } from './blockChainManager';

export interface user{
    privateKey:string;
    publicKey:string;
    balance:number;
    vote:string;
}
export interface transAction{
  creditor:user;
  debtor:user;
  value:number;
  status?: 'done'|'in-progress'|'failed';
}
export interface bloc {
    previousBlockId?:string;
    dateOfCreation:string;
    id: string;
    pendingTransAction:transAction[];
}
export interface blocChain {
    genesisBloc:bloc;
    chain:bloc[];
    pendingTransAction:transAction[];
    difficulty:number;
    miningReward:number;
}
export const createGenesisBloc = () : bloc => ({
  dateOfCreation: Date.now().toString(),
  id: sha256(Date.now()),
  pendingTransAction: [],
});
export const createBlocChain = (difficulty:number, miningReward:number):blocChain => {
  const genesisBloc = createGenesisBloc();
  return {
    genesisBloc,
    chain: [genesisBloc],
    pendingTransAction: [],
    difficulty,
    miningReward,
  };
};
export const getLastBlock = (blockChain: blocChain) : bloc => (
  blockChain.chain[blockChain.chain.length - 1]
);
export const mineANewBlock = (blockChain: blocChain):bloc => {
  const block = getLastBlock(blockChain);
  const dificulty = blockChain.difficulty;
  let hash = sha256(block.dateOfCreation + block.id + Date.now());
  while (hash.substring(0, dificulty) !== Array(dificulty + 1).join('0')) {
    hash = sha256(block.dateOfCreation + block.id + Date.now());
  }
  console.log(`a new bloc with id: ${hash} just got mined *********`);
  console.log(blockChain);
  return {
    dateOfCreation: Date.now().toString(),
    id: hash,
    previousBlockId: block.id,
    pendingTransAction: blockChain.pendingTransAction,
  };
};
export const addBlock = (blok:bloc, toBlokChain:blocChain) : blocChain => {
  toBlokChain.chain.push(blok);
  return toBlokChain;
};
export const minePendingTransActions = (blockChain:blocChain, miningUser:user) : blocChain => {
  //const blocc = mineANewBlock(blockChain);
  const blocc = getLastBlock(blockChain);
  const miningTransaction = {
    creditor: null,
    debtor: miningUser,
    value: blockChain.miningReward,
  };
  blocc.pendingTransAction.push(miningTransaction);
  // blockChain.chain.push(blocc);
  // blockChain.pendingTransAction.push(miningTransaction);
  return blockChain;
};
export const getBalance = (transActor:user, blockChain:blocChain):number => {
  let result = 0;
  for (const block of blockChain.chain) {
    for (const trans of block.pendingTransAction) {
      if (trans.creditor === transActor) {
        result -= trans.value;
      }
      if (trans !== null && trans.debtor.publicKey === transActor.publicKey) {
        result += trans.value;
      }
    }
  }
  return result;
};
