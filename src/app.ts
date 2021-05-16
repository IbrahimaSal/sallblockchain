/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* import { Console } from 'console'; */
import express from 'express';
import { createBlock } from './blockChainManager/createBlock';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];
const blockChain = nbaplayers.map(createBlock);

app.get('/', (req, res) => {
  res.send(blockChain);
});
// start the Express server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
