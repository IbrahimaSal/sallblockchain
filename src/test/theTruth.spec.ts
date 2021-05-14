/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/extensions
import { theTruth } from '../testFunction';

describe('ma première suite de tests', () => {
  it('mon premier test', () => {
    const isTrue = theTruth();
    expect(isTrue).toBe(true);
  });
});
