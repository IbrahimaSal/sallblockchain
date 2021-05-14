/* import { Console } from 'console'; */
import express from 'express';
import { encodeSHA256 } from './encodeSHA256';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];
const tab = [];

nbaplayers.forEach((element, index) => tab.push({ index: index, id: encodeSHA256(index) }));
const tabpreviousnode = [];
nbaplayers.forEach((element, index) => (index > 0) ? tabpreviousnode.push({ index: index, id: encodeSHA256(index), previousnode: encodeSHA256(index-1) }) : (tabpreviousnode.push({ index: 0, id: encodeSHA256(0) })))

app.get('/', (req, res) => {
  res.send(tabpreviousnode);
});
// start the Express server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
