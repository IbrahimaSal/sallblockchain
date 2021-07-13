import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { statusType } from './model/transaction';
import { user } from './model/user';
import {
  addBlock,
  createBlock, createBlockChain, createBlockChainUser, createGenesisBlock,
  findHash, getLastBlock, mine,
} from './service/blockChainManager';
import {
  createTransaction,
  getAllTransactionsByUser,
  getBalance,
} from './service/transactionManagement';
import { createUser, getAllUsers } from './service/Database';
import { ApiOperationStatus } from './model/database';

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const genesisBlock = createGenesisBlock();
const theMiner : user = createBlockChainUser('FirstMiner');
const secondMiner : user = createBlockChainUser('secondMiner');
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
app.get('/', (req, res) => {
  res.send(genesisBlock);
}).get('/blockChain', (req, res) => {
  res.send(blockChain);
}).get('/chain', (req, res) => {
  res.send(blockChain.chain);
}).get('/blockChainTransactions', (req, res) => {
  res.send(blockChain.transactions);
})
  .get('/mine', (req, res) => {
    res.send(mine(blockChain, theMiner));
  })
  .get('/balance', (req, res) => {
    res.send(`theMiners'balance is :${getBalance(blockChain, theMiner)}`);
  })
  .get('/voters', (req, res) => {
    res.send('Nous sommes les voteurs');
  })
  .get('/balance/:publicKey', (req, res) => {
    console.log(getBalance(blockChain, createBlockChainUser(req.params.publicKey)));
    res.send(
      `${getBalance(blockChain,
        createBlockChainUser(req.params.publicKey))}`,
    );
  })
  .get('/createTransaction/:amount/:sender/:receiver', (req, res) => {
    const transactionToCreate = createTransaction(
      Number(req.params.amount),
      createBlockChainUser(req.params.sender),
      createBlockChainUser(req.params.receiver),
      statusType.pending,
    );
    const numberOfBlocks = blockChain.chain.length;
    blockChain.chain[numberOfBlocks - 1].pendingTransactions.push(transactionToCreate);
    res.send(blockChain);
  })
  .get('/createUser/:email',
    async (req, res) => {
      res.send(await createUser(createBlockChainUser(req.params.email)));
    })
  .get('/getAllTransactions/:userpublickey',
    (req, res) => {
      res.send(
        getAllTransactionsByUser(
          blockChain, createBlockChainUser(req.params.userpublickey),
        ),
      );
    })
  .get('/blockChainUsers', async (req, res) => {
    res.send(await getAllUsers());
  })
  .post('/createUser', async (request, res) => {
    try {
      await createUser(createBlockChainUser(request.body.publickey));
      console.log(res);
      return ApiOperationStatus.success;
    } catch (error) {
      console.error(error);
      return ApiOperationStatus.failure;
    }
  });
// app.route('/createUser')
//   .post(async (request, res) => {
//     try {
//       await createUser(createBlockChainUser(request.body.publickey));
//       console.log(res);
//       return ApiOperationStatus.success;
//     } catch (error) {
//       console.error(error);
//       return ApiOperationStatus.failure;
//     }
//   });
module.exports.handler = serverless(app);
