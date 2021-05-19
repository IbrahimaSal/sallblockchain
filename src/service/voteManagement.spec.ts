import { getBalance, getVote } from './voteManagement';

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
