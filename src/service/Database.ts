import AWS from 'aws-sdk';
import { DatabaseOperationStatus } from '../model/database';
import { user } from '../model/user';

require('dotenv').config();

const creds = new AWS.Credentials(process.env.AWSACCESSKEYID, process.env.AWSSECRETKEY);
AWS.config.update({
  region: 'eu-west-3',
  credentials: creds,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

export const createUser = async (userToCreate:user):Promise<DatabaseOperationStatus> => {
  const params = {
    TableName: 'BlockChainUsers',
    Item: {
      PublicKey: userToCreate.publicKey,
      PrivateKey: userToCreate.privateKey,
    },
    ReturnValues: 'ALL_OLD',
    ReturnConsumedCapacity: 'TOTAL',
  };
  try {
    await documentClient.put(params).promise();
    return DatabaseOperationStatus.success;
  } catch (exceptionCaught) {
    console.error(exceptionCaught);
    return DatabaseOperationStatus.failure;
  }
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
