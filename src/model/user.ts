import { sha256 } from '../service/blockChainManager';

export interface User{
    privateKey:string;
    publicKey:string;
    balance:number;
    vote:string;
  }

export const nbaplayers = ['Wiggins', 'Curry', 'Lebron', 'James', 'Paul', 'Zion', 'Brandon', 'Ingram', 'Anthony', 'Davis', 'Jimmy', 'Butler'];

export const usersList = nbaplayers.map((nbaPlayerName) => ({
  privateKey: nbaPlayerName,
  publicKey: sha256(nbaPlayerName),
  balance: nbaPlayerName.length * Math.random(),
  vote: nbaPlayerName,
}));
