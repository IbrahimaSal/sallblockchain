import { transaction } from './transaction';

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
}
