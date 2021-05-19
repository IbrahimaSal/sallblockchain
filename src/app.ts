import express from 'express';
import { createABlockChain, isThisBlockChainValid, addAblockToBlockChain } from './service/blockChainManager';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];
const blockChain = createABlockChain(nbaplayers.length);

app.get('/', (req, res) => {
  res.send('Hello');
});
app.get('/validity', (req, res) => {
  res.send(isThisBlockChainValid(addAblockToBlockChain(blockChain)));
});
// start the Express server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
