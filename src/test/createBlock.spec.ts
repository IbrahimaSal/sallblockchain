import {
  sha256, createABlockChain, createBlock, getLastBlock,
} from '../service/blockChainManager';

describe('Test de ma fonction de hachage', () => {
  it('mon deuxieme test', () => {
    // given
    const zero = sha256(0);
    // when
    const result = '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9';
    // then
    expect(zero).toStrictEqual(result);
  });
});
describe('createBlock', () => {
  it('returns a genesis block (without previous blockId) when index is zero', () => {
    // given
    const genesisBlock = { position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // when
    const genBlock = createBlock('iba', 0);
    // then
    expect(genBlock).toStrictEqual(genesisBlock);
  });
  it('returns a blocks (with a previousId) ', () => {
    // given
    const expectedBlock = { position: '1', id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // when
    const genBlock = createBlock('iba', 1);
    // then
    expect(expectedBlock).toStrictEqual(genBlock);
  });
});

describe('createABlockChain', () => {
  it('returns a genesis block when index is zero', () => {
    // given
    const genesisBlock = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }];
    // when
    const genBlock = createABlockChain(1);
    // then
    expect(genBlock).toStrictEqual(genesisBlock);
  });
  it('returns an array of blocks', () => {
    // given
    const expectedBlockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '1', id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '2', id: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', previousBlockId: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' }, { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }];
    // when
    const genBlockChain = createABlockChain(4);
    // then
    expect(expectedBlockChain).toStrictEqual(genBlockChain);
  });
});
describe('getLastBlock', () => {
  it('returns a genesis block when the target is a one element blockchain', () => {
    const blockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }];
    // given
    const expectedGenesisBlock = { position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // when
    const genBlock = getLastBlock(blockChain);
    // then
    expect(genBlock).toStrictEqual(expectedGenesisBlock);
  });
  it('returns the last element(with previousBlockId) of (multi-element) blockchain', () => {
    const testedBlockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '1', id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '2', id: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', previousBlockId: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' }, { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }];
    // given
    const expectedLastBlock = { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' };
    // when
    const genLastBlock = getLastBlock(testedBlockChain);
    // then
    expect(expectedLastBlock).toStrictEqual(genLastBlock);
  });
});
