import AWS from 'aws-sdk';
import { user } from '../model/user';

require('dotenv').config();

const creds = new AWS.Credentials(process.env.AWSACCESSKEYID, process.env.AWSSECRETKEY);
AWS.config.update({
  region: 'eu-west-3',
  credentials: creds,
});

const saveUserInTable = (User:user, tablename:string) : user => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: tablename,
    Item: {
      PublicKey: User.publicKey,
      PrivateKey: User.privateKey,
    },
  };
  console.log(`Adding ${JSON.stringify(User)} to ${tablename}`);
  try {
    documentClient.put(params, (err: AWS.AWSError,
      data: AWS.DynamoDB.DocumentClient.PutItemOutput) : void => {
      if (err) {
        console.error(`Unable to add ${JSON.stringify(User)} to ${tablename}. Error JSON:`, JSON.stringify(err, null, 2));
      } else {
        console.error('Added item:', JSON.stringify(data, null, 2));
      }
    });
  } catch (error) {
    console.error(error);
  }
  return User;
};
export default saveUserInTable;

export const scanTable = async (tableName:string):Promise<any[]> => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params : AWS.DynamoDB.Types.ScanInput = {
    TableName: tableName,
  };
  const scanResults:any[] = [];
  const items = await documentClient.scan(params).promise();
  do {
    items.Items.forEach((item:any) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');
  return scanResults;
};

const onScan = (users:user[]) => (
  error: AWS.AWSError, data:AWS.DynamoDB.DocumentClient.ScanOutput
  ):void => {
  if (error) {
    console.error('Unable to scan the table. Error JSON:', JSON.stringify(error, null, 2));
  } else {
    data.Items.forEach((User:user) => {
        return users.push(User);
      });
  }
};

export const scanBlockChainUserTable = async (
  tablename:string,
): Promise<user[]> => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params : AWS.DynamoDB.Types.ScanInput = {
    TableName: tablename,
  };
  console.log('Scanning BlockChain users table.');
  const users : user[] = [];
  try {
    await documentClient.scan(params, 
    onScan(users)).promise();
  } catch (error) {
    console.error(error);
  }
  return users;
};
