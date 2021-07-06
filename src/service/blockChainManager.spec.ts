import {
  addBlock,
  createBlock,
  createBlockChain,
  createGenesisBlock,
  findHash,
  getLastBlock,
  mine,
  sha256,
} from './blockChainManager';
import { block } from '../model/block';
import { statusType, transaction } from '../model/transaction';
import { user } from '../model/user';
import { createTransaction, getBalance } from './transactionManagement';
import { scanBlockChainUserTable, scanTable2 } from './Database';

describe('sha256', () => {
  it(' returns the result encryption code of 0', () => {
    // given
    const zero = sha256(0);
    // when
    const result = '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9';
    // then
    expect(zero).toStrictEqual(result);
  });
});
describe('createGenesisBlock', () => {
  it(' returns a block without previousId', () => {
    // when
    const genesisBlock = createGenesisBlock();
    // then
    expect(genesisBlock.previousId).toBe(undefined);
    expect(genesisBlock.pendingTransactions).toEqual([]);
  });
});
describe('createBlock', () => {
  it(' returns a block', () => {
    // given
    const mockTransaction :transaction = {
      amount: 10,
      sender: null,
      receiver: null,
      status: statusType.pending,
    };
    // when
    const bloc : block = createBlock('A', 'B');
    bloc.pendingTransactions.push(mockTransaction);
    // then
    expect(bloc.previousId).toStrictEqual('A');
    expect(bloc.id).toStrictEqual('B');
    expect(bloc.pendingTransactions[0].amount).toStrictEqual(10);
    expect(bloc.pendingTransactions[0].sender).toStrictEqual(null);
    expect(bloc.pendingTransactions[0].receiver).toStrictEqual(null);
    expect(bloc.pendingTransactions[0].status).toStrictEqual(1);
  });
});

describe('createBlockChain', () => {
  it(' returns a blockChain', () => {
    // given
    // when
    const blockChain = createBlockChain(100, 2);
    // then
    expect(blockChain.miningReward).toStrictEqual(100);
    expect(blockChain.difficulty).toStrictEqual(2);
    expect(blockChain.chain[0].previousId).toStrictEqual(undefined);
  });
});

describe('addBlock', () => {
  it(' add a block to a blockchain', () => {
    // given
    const blockChain = createBlockChain(100, 2);
    const mockTransaction = {
      amount: 10,
      sender: null,
      receiver: null,
      status: statusType.pending,
    };
    const blockToAdd : block = createBlock('A', 'B');
    blockToAdd.pendingTransactions.push(mockTransaction);
    // when
    addBlock(blockChain, blockToAdd);
    // then
    expect(blockChain.chain[blockChain.chain.length - 1]).toStrictEqual(blockToAdd);
  });
});
describe('findHash', () => {
  it(' returns the result encryption code of 0', () => {
    // given
    const blockChain = createBlockChain(100, 2);
    const blockToAdd1 : block = createBlock('A', 'B');
    const mockTransaction = {
      amount: 10,
      sender: null,
      receiver: null,
      status: statusType.pending,
    };
    blockToAdd1.pendingTransactions.push(mockTransaction);
    addBlock(blockChain, blockToAdd1);
    // when
    const blockToAdd2 :block = createBlock(
      blockToAdd1.id, findHash(blockToAdd1.id, blockChain.difficulty),
    );
    addBlock(blockChain, blockToAdd2);
    // then
    expect(getLastBlock(blockChain).id.substring(0, 2)).toStrictEqual('00');
  });
});
describe('mine', () => {
  it(' returns the result encryption code of 0', () => {
    // given
    const firstMiner : user = { privateKey: 'FirstMiner', publicKey: '24052021' };
    const secondMiner : user = { privateKey: 'secondMiner', publicKey: '24052022' };
    const blockChain = createBlockChain(100, 2);
    const block1 = createBlock(blockChain.chain[0].id, findHash(blockChain.chain[0].id, 2));
    addBlock(blockChain, block1);
    const block2 = createBlock(blockChain.chain[1].id, findHash(blockChain.chain[1].id, 2));
    addBlock(blockChain, block2);
    const block3 = createBlock(blockChain.chain[2].id, findHash(blockChain.chain[2].id, 2));
    addBlock(blockChain, block3);
    // when
    const transaction1 = createTransaction(400, null, firstMiner, statusType.achieved);
    const transaction2 = createTransaction(50, firstMiner, secondMiner, statusType.pending);
    const transaction31 = createTransaction(50, null, secondMiner, statusType.pending);
    const transaction32 = createTransaction(50, firstMiner, null, statusType.pending);
    blockChain.transactions.push(transaction1);
    block3.pendingTransactions.push(transaction2);
    block3.pendingTransactions.push(transaction31);
    block3.pendingTransactions.push(transaction32);
    mine(blockChain, firstMiner);
    // then
    expect(getBalance(blockChain, firstMiner)).toStrictEqual(400);
    expect(getBalance(blockChain, secondMiner)).toStrictEqual(100);
  });
});
describe('scantable2', () => {
  it(' returns the result encryption code of 0', async () => {
    // given
    const tablename = 'BlockChainUsers';
    // when
    const result = await scanTable2(tablename);
    // then
    expect(result.length).toStrictEqual(7);
  });
});

describe('scanBlockChainUserTable', () => {
  it(' returns the result encryption code of 0', async () => {
    // given
    const tablename = 'BlockChainUsers';
    // when
    const result = await scanBlockChainUserTable(tablename);
    // then
    expect(result.length).toStrictEqual(7);
  });
});
