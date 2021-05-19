/* eslint-disable no-param-reassign */
import { voter } from '../model/voter';

export const getBalance = (user :voter) : number => user.balance;

export const getVote = (user :voter) : string => user.vote;

export const transaction = (userA :voter, userB :voter, amount: number) : boolean => {
  if (userA.balance < amount || amount < 0) {
    return false;
  }
  userA.balance -= amount;
  userB.balance += amount;
  return true;
};
