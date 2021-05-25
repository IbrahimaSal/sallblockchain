import { transaction } from './transaction';
import { user } from './user';

export interface block {
  previousId?: string;
  id: string;
  pendingTransactions:transaction[];
}
export interface blockChain{
  chain: block[];
  transactions: transaction[];
  miningReward: number;
  difficulty: number;
  rootUser:user;
}
