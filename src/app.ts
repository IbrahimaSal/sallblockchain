import { Console } from 'console';
import express from 'express';
const app = express();
const port = 3000;
const nbaplayers=['Wiggins','Curry','Lebron','James','Paul','Zion','Brandon','Ingram','Anthony','Davis','Jimmy','Butler']
function show(array){
  return array.reduce(function(memo, val) {
    return memo + ' , '+val;
  });
}
app.get('/', (req, res) => {
  //res.send('The sedulous hyena ate the antelope!');
  res.send(show(nbaplayers));
});
// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
});