import { user } from './user';

export interface transaction {
    amount:number;
    sender: user;
    receiver: user;
    status: statusType;
  }
export enum statusType {
  'achieved',
  'pending',
  'failed',
}
