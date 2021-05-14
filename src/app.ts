/* import { Console } from 'console'; */
import express from 'express';

const app = express();
const port = 3000;
const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];

app.get('/', (req, res) => {
  res.send(nbaplayers);
});
// start the Express server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
