/* eslint-disable no-param-reassign */
import { user } from '../model/user';

export const getBalance = (user :user) : number => user.balance;

export const getVote = (user :user) : string => user.vote;

export const transaction = (userA :user, userB :user, amount: number) : boolean => {
  if (userA.balance < amount || amount < 0) {
    return false;
  }
  userA.balance -= amount;
  userB.balance += amount;
  return true;
};
