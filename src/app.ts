import express from 'express';
import { nbaplayers, usersList } from './model/user';
import {
  createABlockChain, isThisBlockChainValid, addAblockToBlockChain,
} from './service/blockChainManager';

const app = express();
const port = 3000;

const blockChain = createABlockChain(nbaplayers.length);

app.get('/', (req, res) => {
  res.send(blockChain);
}).get('/validity', (req, res) => {
  res.send(isThisBlockChainValid(addAblockToBlockChain(blockChain)));
}).get('/users', (req, res) => {
  res.send(usersList);
}).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
