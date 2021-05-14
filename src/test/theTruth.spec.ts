import { theTruth } from '../testFunction';

describe('ma première suite de tests', () => {
  it('mon premier test', () => {
    const isTrue = theTruth();
    expect(isTrue).toBe(true);
  });
});
