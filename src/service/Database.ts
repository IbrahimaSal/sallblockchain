/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import AWS from 'aws-sdk';
import { user } from '../model/user';
import { createUser } from './blockChainManager';

AWS.config.update({
  region: 'eu-west-3',
  // endpoint: 'http://localhost:8000',
});

const saveUserInTable = (User:user, tablename:string) : user => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: tablename,
    Item: {
      PublicKey: User.publicKey,
      PrivateKey: User.privateKey,
    },
  };
  console.log(`Adding ${JSON.stringify(User)} to ${tablename}`);
  docClient.put(params, (err: any, data: any) => {
    if (err) {
      console.error(`Unable to add ${JSON.stringify(User)} to ${tablename}. Error JSON:`, JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
    }
  });
  return User;
};
export default saveUserInTable;

// saveUserInTable(createUser('isall1992@icloud.com'), 'BlockChainUsers');
// saveUserInTable(createUser('moulingaiba@gmail.com'), 'BlockChainUsers');
// saveUserInTable(createUser('messi72@gmail.com'), 'BlockChainUsers');
// saveUserInTable(createUser('DucDeLyon8@gmail.com'), 'BlockChainUsers');

export const scanTable2 = async (tableName) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params : AWS.DynamoDB.Types.ScanInput = {
    TableName: tableName,
  };
  const scanResults = [];
  let items;
  do {
    items = await documentClient.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');
  return scanResults;
};

const onScan = (users) => (err, data) => {
  if (err) {
    console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    data.Items
      .forEach((User) => {
        users.push(User);
      });
  }
};

export const scanBlockChainUserTable = async (
  tablename:string,
): Promise<user[]> => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params : AWS.DynamoDB.Types.ScanInput = {
    TableName: tablename,
  };
  console.log('Scanning BlockChain users table.');
  const users = [];
  await docClient.scan(params, onScan(users)).promise();
  return users;
};
