/* eslint-disable max-len */
import { sha256 } from './blockChainManager';
import {
  addBlock, getLastBlock, createBlocChain, createGenesisBloc, mineANewBlock, minePendingTransActions, user, getBalance,
} from './newBlockChainManager';

describe('createGenesisBlock', () => {
  it(' returns the result encryption code of 0', () => {
    // given
    // when
    const genBlock = createGenesisBloc();
    // then
    expect(sha256(genBlock.dateOfCreation.toString())).toEqual(genBlock.id);
  });
});
describe('createBlocChain', () => {
  it(' returns a new blockchain', () => {
    // given
    // when
    const genblockchain = createBlocChain(2, 100);
    // then
    expect(genblockchain.chain[0]).toEqual(genblockchain.genesisBloc);
    expect(2).toEqual(genblockchain.difficulty);
    expect(100).toEqual(genblockchain.miningReward);
  });
});
describe('mineANewBlock', () => {
  it(' returns a mined block', () => {
    // given
    const genblockchain = createBlocChain(2, 100);
    // when
    const minedBlock = mineANewBlock(genblockchain);
    // then
    expect(minedBlock.previousBlockId).toEqual(genblockchain.genesisBloc.id);
    expect('00').toEqual(minedBlock.id.substring(0, 2));
  });
});
describe('addBlock', () => {
  it(' returns a blockchain where a new block is added', () => {
    // given
    const genblockchain = createBlocChain(2, 100);
    const minedBlock = mineANewBlock(genblockchain);
    // when
    const newBlockChain = addBlock(minedBlock, genblockchain);
    // then
    expect(newBlockChain.chain[newBlockChain.chain.length - 1]).toEqual(minedBlock);
  });
});
describe('minePendingTransActions', () => {
  it('returns a new blockchain where a new transaction is added to the pendingTransaction chain', () => {
    // given
    const genblockchain = createBlocChain(2, 100);
    const minedBlock = mineANewBlock(genblockchain);
    const newBlockChain = addBlock(minedBlock, genblockchain);
    const voter : user = {
      privateKey: 'ipson',
      publicKey: '22071992',
      balance: 0,
      vote: 'Melenchon',
    };
    // when
    const updatedblockchain = minePendingTransActions(newBlockChain, voter);
    const lastBlock = getLastBlock(updatedblockchain);
    // then
    expect(lastBlock.pendingTransAction[lastBlock.pendingTransAction.length - 1])
      .toEqual(updatedblockchain.chain[updatedblockchain.chain.length - 1].pendingTransAction[0]);
    expect(getBalance(voter, updatedblockchain)).toEqual(100);
  });
});
