/* eslint-disable max-len */
/* eslint-disable no-console */
import serverless from 'serverless-http';
import express from 'express';

import cors from 'cors';
import { statusType } from './model/transaction';
import { user } from './model/user';
import {
  addBlock,
  createBlock, createBlockChain, createGenesisBlock, findHash, getLastBlock, mine,
} from './service/blockChainManager';
import { createTransaction, getBalance } from './service/transactionManagement';

// const cors = cors();

const app = express();
app.use(cors());

// app.options('*', cors());
// app.use(cors({
//   allowedHeaders: ['sessionId', 'Content-Type',
//     'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers',
//     'Origin', 'Accept', 'X-Requested-With', 'Access-Control-Request-Method',
//     'Access-Control-Request-Headers', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
//   exposedHeaders: ['sessionId'],
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
// }));

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
  res.send(genesisBlock);
}).get('/blockChain', (req, res) => {
  res.send(blockChain);
}).get('/chain', (req, res) => {
  res.send(blockChain.chain);
}).get('/blockChainTransactions', (req, res) => {
  res.send(blockChain.transactions);
})
  .get('/balance', (req, res) => {
    res.send(`theMiners'balance is :${getBalance(blockChain, theMiner)}`);
  })
  .get('/voters', (req, res) => {
    res.send('Nous sommes les voteurs');
  });

// const port = 5000;
// app.listen(port, () => {
//   console.log(`server started at http://localhost:${port}`);
// });

module.exports.handler = serverless(app);
