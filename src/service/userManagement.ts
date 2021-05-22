/* eslint-disable no-param-reassign */
import { User } from '../model/user';

export const getBalance = (user :User) : number => user.balance;

export const getVote = (user :User) : string => user.vote;

export const transaction = (userA :User, userB :User, amount: number) : boolean => {
  if (userA.balance < amount || amount < 0) {
    return false;
  }
  userA.balance -= amount;
  userB.balance += amount;
  return true;
};
