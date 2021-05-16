import { encodeSHA256 } from '../blockChainManager/encodeSHA256';

describe('Test de ma fonction de hachage', () => {
  it('mon deuxieme test', () => {
    // should
    const zero = encodeSHA256(0);
    // given
    const result = '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9';
    // then
    expect(zero).toStrictEqual(result);
  });
});
