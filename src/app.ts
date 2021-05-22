import express from 'express';
import {
  createABlockChain, isThisBlockChainValid, addAblockToBlockChain, sha256,
} from './service/blockChainManager';
import { User } from './model/user';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];
const blockChain = createABlockChain(nbaplayers.length);
const usersList : User[] = [];

nbaplayers.forEach((element) => usersList.push({
  privateKey: element,
  publicKey: sha256(element),
  balance: element.length * Math.random(),
  vote: element,
}));
usersList.push();

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
