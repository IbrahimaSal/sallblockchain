import { createBlock } from '../blockChainManager/createBlockChain';
import { getLastBlock } from '../blockChainManager/getLastBlock';

describe('getLastBlock', () => {
  it('returns a genesis block when blockChain is generated with an array element', () => {
    // should
    const genesisBlock = { index: 0, id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // given
    const genBlock = createBlock('ipson', 0);
    // then
    expect(genBlock).toEqual(genesisBlock);
  });
  it('returns a block with previous id when index is not null', () => {
    // should
    const secondBlock = { index: 1, id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlock: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // given
    const gensecondBlock = createBlock('ipson', 1);
    // then
    expect(secondBlock).toEqual(gensecondBlock);
  });
});