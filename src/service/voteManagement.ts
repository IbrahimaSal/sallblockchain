import { voter } from '../model/voter';

export const getBalance = (user :voter) : number => user.balance;

export const getVote = (user :voter) : string => user.vote;
