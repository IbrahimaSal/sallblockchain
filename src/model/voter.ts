export interface voter{
    privateKey:string;
    publicKey:string;
    balance:number;
    vote:string;
}
export interface transaction{
  creditor:voter;
  debtor:voter;
  value:number;
  success: boolean;
  message:string;
}
