import { statusType } from '../model/transaction';
import { user } from '../model/user';
import {
  addBlock, createBlock, createBlockChain, findHash,
} from './blockChainManager';
import {
  createTransaction, getBalance, minePendingBuyOrSellTransaction, minePendingExchangeTransaction,
} from './transactionManagement';

describe('getBalance', () => {
  it(' get balance of a user', () => {
    const root : user = {
      PrivateKey: 'IbaSall',
      PublicKey: '220071992',
    };
    const firstMiner : user = { PrivateKey: 'FirstMiner', PublicKey: '24052021' };
    const secondMiner : user = { PrivateKey: 'secondMiner', PublicKey: '24052022' };
    const blockChain = createBlockChain(100, 2);
    const block1 = createBlock(
      blockChain.chain[0].id, findHash(blockChain.chain[0].id, 2),
    );
    addBlock(blockChain, block1);
    const block2 = createBlock(blockChain.chain[1].id, findHash(blockChain.chain[1].id, 2));
    addBlock(blockChain, block2);
    const block3 = createBlock(blockChain.chain[2].id, findHash(blockChain.chain[2].id, 2));
    addBlock(blockChain, block3);
    // given
    const transaction1 = createTransaction(400, root, firstMiner, statusType.achieved);
    const transaction2 = createTransaction(50, firstMiner, secondMiner, statusType.achieved);
    blockChain.transactions.push(transaction1);
    blockChain.transactions.push(transaction2);
    // when
    // then
    expect(getBalance(blockChain, firstMiner)).toStrictEqual(350);
    expect(getBalance(blockChain, secondMiner)).toStrictEqual(50);
  });
});
describe('minePendingExchangeTransaction', () => {
  it(' mine a transaction between two user in a given block', () => {
    // given
    const root2 : user = {
      PrivateKey: 'IbaSall',
      PublicKey: '220071992',
    };
    const firstMiner2 : user = { PrivateKey: 'FirstMiner2', PublicKey: '240520212' };
    const secondMiner2 : user = { PrivateKey: 'secondMiner2', PublicKey: '240520222' };
    const blockChain2 = createBlockChain(100, 2);
    const block12 = createBlock(
      blockChain2.chain[0].id, findHash(blockChain2.chain[0].id, 2),
    );
    addBlock(blockChain2, block12);
    const block22 = createBlock(blockChain2.chain[1].id, findHash(blockChain2.chain[1].id, 2));
    addBlock(blockChain2, block22);
    const block32 = createBlock(blockChain2.chain[2].id, findHash(blockChain2.chain[2].id, 2));
    addBlock(blockChain2, block32);
    const transaction12 = createTransaction(400, root2, firstMiner2, statusType.achieved);
    const transaction22 = createTransaction(50, firstMiner2, secondMiner2, statusType.pending);
    blockChain2.transactions.push(transaction12);
    block32.pendingTransactions.push(transaction22);
    minePendingExchangeTransaction(blockChain2, block32);
    // when
    // then
    expect(getBalance(blockChain2, firstMiner2)).toStrictEqual(350);
    expect(getBalance(blockChain2, secondMiner2)).toStrictEqual(50);
  });
});
describe('minePendingBuyOrSellTransaction', () => {
  it(' mine a buy or sell transaction request if a correct match is found', () => {
    // given
    const root3 : user = {
      PrivateKey: 'IbaSall3',
      PublicKey: '2200719923',
    };
    const firstMiner3 : user = { PrivateKey: 'FirstMiner3', PublicKey: '2405202123' };
    const secondMiner3 : user = { PrivateKey: 'secondMiner3', PublicKey: '2405202223' };
    const blockChain3 = createBlockChain(100, 2);
    const block13 = createBlock(
      blockChain3.chain[0].id, findHash(blockChain3.chain[0].id, 2),
    );
    addBlock(blockChain3, block13);
    const block23 = createBlock(blockChain3.chain[1].id, findHash(blockChain3.chain[1].id, 2));
    addBlock(blockChain3, block23);
    const block33 = createBlock(blockChain3.chain[2].id, findHash(blockChain3.chain[2].id, 2));
    addBlock(blockChain3, block33);
    const transaction13 = createTransaction(400, root3, firstMiner3, statusType.achieved);
    const transaction231 = createTransaction(50, firstMiner3, null, statusType.pending);
    const transaction232 = createTransaction(50, null, secondMiner3, statusType.pending);
    const impossibleTransaction = createTransaction(5000, secondMiner3, null, statusType.pending);

    blockChain3.transactions.push(transaction13);
    block33.pendingTransactions.push(transaction231);
    block33.pendingTransactions.push(transaction232);
    block33.pendingTransactions.push(impossibleTransaction);
    minePendingBuyOrSellTransaction(blockChain3, block33);
    // when
    // then
    expect(getBalance(blockChain3, firstMiner3)).toStrictEqual(350);
    expect(getBalance(blockChain3, secondMiner3)).toStrictEqual(50);
    expect(block33.pendingTransactions.find((tr) => tr === impossibleTransaction).status)
      .toStrictEqual(1);
  });
});
