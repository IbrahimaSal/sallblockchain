import AWS from 'aws-sdk';
import { user } from '../model/user';

require('dotenv').config();

const creds = new AWS.Credentials(process.env.AWSACCESSKEYID, process.env.AWSSECRETKEY);
AWS.config.update({
  region: 'eu-west-3',
  credentials: creds,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

export const createUser = async (userToCreate:user):Promise<String> => {
  const params = {
    TableName: 'BlockChainUsers',
    Item: {
      PublicKey: userToCreate.publicKey,
      PrivateKey: userToCreate.privateKey,
    },
    ReturnValues: 'ALL_OLD',
    ReturnConsumedCapacity: 'TOTAL',
  };
  let result:string;
  let dataToDisplay:string;
  try {
    do {
      // eslint-disable-next-line no-await-in-loop
      await documentClient.put(params,
        // eslint-disable-next-line no-loop-func
        (error, data) => {
          if (error) {
            result = (`Unable to add ${JSON.stringify(userToCreate)} to the Table BlockChainUsers, because of this Error: \n 
            ${JSON.stringify(error, null, 2)}`);
            dataToDisplay = JSON.stringify(error);
          } else {
            dataToDisplay = JSON.stringify(data.Attributes);
            result = `Added item: ${JSON.stringify(data, null, 2)}`;
          }
        }).promise();
    } while (typeof dataToDisplay === 'undefined');
  } catch (exceptionCaught) {
    console.error(exceptionCaught);
  }
  return result;
};

export const scanTable = async ():Promise<any[]> => {
  const params : AWS.DynamoDB.Types.ScanInput = {
    TableName: 'BlockChainUsers',
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
  error: AWS.AWSError, data:AWS.DynamoDB.DocumentClient.ScanOutput,
):void => {
  if (error) {
    console.error('Unable to scan the table. Error JSON:', JSON.stringify(error, null, 2));
  } else {
    data.Items.forEach((User:user) => users.push(User));
  }
};

export const getAllUsers = async (): Promise<user[]> => {
  const params : AWS.DynamoDB.Types.ScanInput = {
    TableName: 'BlockChainUsers',
  };
  const users : user[] = [];
  try {
    await documentClient.scan(params, onScan(users)).promise();
  } catch (error) {
    console.error(`getAllUsers: ${error}`);
  }
  return users;
};
