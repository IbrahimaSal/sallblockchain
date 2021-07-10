import { user } from './user';

export interface transaction {
  amount:number;
  sender: user;
  receiver: user;
  status: statusType;
}
export enum statusType {
  'achieved'='achieved',
  'pending'='pending',
  'failed'='failed',
}
