/* eslint-disable no-console */
import serverless from 'serverless-http';
import express from 'express';
import { statusType } from './model/transaction';
import { user } from './model/user';
import {
  addBlock,
  createBlock, createBlockChain, createGenesisBlock, findHash, getLastBlock, mine,
} from './service/blockChainManager';
import { createTransaction, getBalance } from './service/transactionManagement';

const app = express();
// const port = 3000;
const genesisBlock = createGenesisBlock();
const theMiner : user = { privateKey: 'FirstMiner', publicKey: '24052021' };
const secondMiner : user = { privateKey: 'secondMiner', publicKey: '24052022' };
const blockChain = createBlockChain(100, 2);
const block1 = createBlock(
  blockChain.chain[0].id, findHash(blockChain.chain[0].id, 2),
);
addBlock(blockChain, block1);
const block2 = createBlock(
  blockChain.chain[1].id, findHash(blockChain.chain[1].id, 2),
);
addBlock(blockChain, block2);
const block3 = createBlock(
  blockChain.chain[2].id, findHash(blockChain.chain[2].id, 2),
);
addBlock(blockChain, block3);
mine(blockChain, theMiner);
const Transaction2 = createTransaction(20, theMiner, secondMiner, statusType.pending);
const Transaction5 = createTransaction(2000, theMiner, secondMiner, statusType.pending);
const Transaction3 = createTransaction(10, null, secondMiner, statusType.pending);
const Transaction4 = createTransaction(10, theMiner, null, statusType.pending);
getLastBlock(blockChain).pendingTransactions.push(Transaction2);
getLastBlock(blockChain).pendingTransactions.push(Transaction3);
getLastBlock(blockChain).pendingTransactions.push(Transaction4);
getLastBlock(blockChain).pendingTransactions.push(Transaction5);
mine(blockChain, theMiner);
console.log(getBalance(blockChain, theMiner));
console.log(getBalance(blockChain, secondMiner));
console.log(blockChain.transactions);
app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send(genesisBlock);
}).get('/blockChain', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send(blockChain);
}).get('/chain', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send(blockChain.chain);
}).get('/blockChainTransactions', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send(blockChain.transactions);
})
  .get('/balance', (req, res) => {
    res.send(`theMiners'balance is :${getBalance(blockChain, theMiner)}`);
  })
  .get('/voters', (req, res) => {
    res.send('Nous sommes les voteurs');
  });

// .listen(port, () => {
//   console.log(`server started at http://localhost:${port}`);
// });

module.exports.handler = serverless(app);
