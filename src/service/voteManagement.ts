/* eslint-disable no-param-reassign */
import { voter, transaction } from '../model/voter';

export const getBalance = (user :voter) : number => user.balance;

export const getVote = (user :voter) : string => user.vote;

export const createTransaction = (creditor:voter, debtor:voter, value:number) :transaction => {
  const result:transaction = (
    {
      creditor,
      debtor,
      value,
      success: (value > 0 && creditor.balance >= value),
      message: (value > 0 && creditor.balance >= value)
        ? (`${creditor.publicKey} has successfully sent ${value} to ${debtor.publicKey}`)
        : (`transaction operation has failed because: ${(value < 0)
          ? 'the amount to exchange is negative'
          : (`${creditor.publicKey} has not enough credit`)}`),
    }
  );
  if (result.success) {
    creditor.balance -= value;
    debtor.balance += value;
  }
  return result;
};
