import { getBalance, getVote, transaction } from './voteManagement';

describe('getBalance', () => {
  it(' returns the balance of a voter', () => {
    // given
    const lambdaUser = {
      privateKey: 'Sall',
      publicKey: '22071992',
      balance: 45,
      vote: 'Bernie Sanders',
    };
      // when
    const balanceOfLambdaUser = getBalance(lambdaUser);
    // then
    expect(45).toStrictEqual(balanceOfLambdaUser);
  });
});

describe('getVote', () => {
  it(' returns the vote of a user', () => {
    // given
    const lambdaUser = {
      privateKey: 'Sall',
      publicKey: '22071992',
      balance: 45,
      vote: 'Bernie Sanders',
    };
    // when
    const voteOfAlambdaUser = getVote(lambdaUser);
    // then
    expect('Bernie Sanders').toStrictEqual(voteOfAlambdaUser);
  });
});
describe('transaction', () => {
  it(' returns if an exchanged has succeeded between 2 users', () => {
    // given
    const userA = {
      privateKey: 'A',
      publicKey: '22071992',
      balance: 1000,
      vote: 'Bernie Sanders',
    };
    const userB = {
      privateKey: 'B',
      publicKey: '22071993',
      balance: 500,
      vote: 'Bernie Sanders',
    };
    const amount = 250;
    // when
    const transactionSucceeded = transaction(userA, userB, amount);
    // then
    expect(750).toStrictEqual(userA.balance);
    expect(750).toStrictEqual(userB.balance);
    expect(true).toStrictEqual(transactionSucceeded);
  });
});
describe('transaction', () => {
  it(' returns if an exchanged has succeeded between 2 users', () => {
    // given
    const userA = {
      privateKey: 'A',
      publicKey: '22071992',
      balance: 1000,
      vote: 'Bernie Sanders',
    };
    const userB = {
      privateKey: 'B',
      publicKey: '22071993',
      balance: 500,
      vote: 'Bernie Sanders',
    };
    const amount = 2500;
    // when
    const transactionSucceeded = transaction(userA, userB, amount);
    // then
    expect(1000).toStrictEqual(userA.balance);
    expect(500).toStrictEqual(userB.balance);
    expect(false).toStrictEqual(transactionSucceeded);
  });
});
