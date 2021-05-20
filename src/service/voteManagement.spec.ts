import { getBalance, getVote, createTransaction } from './voteManagement';

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
describe('createTransaction', () => {
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
    const transactionOperation = createTransaction(userA, userB, amount);
    // then
    expect(750).toStrictEqual(userA.balance);
    expect(750).toStrictEqual(userB.balance);
    expect(true).toStrictEqual(transactionOperation.success);
    expect(`${userA.publicKey} has successfully sent ${amount} to ${userB.publicKey}`)
      .toStrictEqual(transactionOperation.message);
  });
});
describe('createTransaction', () => {
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
    const transactionOperation = createTransaction(userA, userB, amount);
    // then
    expect(1000).toStrictEqual(userA.balance);
    expect(500).toStrictEqual(userB.balance);
    expect(false).toStrictEqual(transactionOperation.success);
    expect(`transaction operation has failed because: ${userA.publicKey} has not enough credit`)
      .toStrictEqual(transactionOperation.message);
  });
});
describe('createTransaction', () => {
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
    const amount = -2500;
    // when
    const transactionOperation = createTransaction(userA, userB, amount);
    // then
    expect(1000).toStrictEqual(userA.balance);
    expect(500).toStrictEqual(userB.balance);
    expect(false).toStrictEqual(transactionOperation.success);
    expect('transaction operation has failed because: the amount to exchange is negative')
      .toStrictEqual(transactionOperation.message);
  });
});
