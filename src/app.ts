import express from 'express';
import {
  createABlockChain, isThisBlockChainValid, addAblockToBlockChain, sha256,
} from './service/blockChainManager';
import { voter } from './model/voter';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];
const blockChain = createABlockChain(nbaplayers.length);
const votersList : voter[] = [];
nbaplayers.forEach((element) => votersList.push({
  privateKey: element,
  publicKey: sha256(element),
  balance: element.length * Math.random(),
  vote: element,
}));
votersList.push();

app.get('/', (req, res) => {
  res.send(blockChain);
}).get('/validity', (req, res) => {
  res.send(isThisBlockChainValid(addAblockToBlockChain(blockChain)));
}).get('/voters', (req, res) => {
  res.send(votersList);
}).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
