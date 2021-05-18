import express from 'express';
import { createABlockChain, isThisBlockChainValid, addAblockToBlockChain } from './service/blockChainManager';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];
const blockChain = createABlockChain(nbaplayers.length);
/*

function mine(bloc:block, difficulty:number): block {
  let h = sha256(bloc.position + bloc.id + timeStamp);
  while (h.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    h = sha256(bloc.position + bloc.id + timeStamp);
    console.log(`un nouveau bloc ayant pour id: ${h} vient d'etre miné`);
  }
  return { position: bloc.position + 1, id: h, previousBlockId: bloc.id };
}

*/

app.get('/', (req, res) => {
  res.send(isThisBlockChainValid(addAblockToBlockChain(blockChain)));
});
// start the Express server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
