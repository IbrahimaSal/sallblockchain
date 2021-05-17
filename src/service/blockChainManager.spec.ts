import {
  sha256, createABlockChain, createBlock, getLastBlock, isIntegrous,
} from './blockChainManager';

describe('sha256', () => {
  it(' returns the result encryption code of 0', () => {
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
    const expectedGenesisBlock = { position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // when
    const result = createBlock('iba', 0);
    // then
    expect(result).toStrictEqual(expectedGenesisBlock);
  });
  it('returns a blocks (with a previousId) ', () => {
    // given
    const expectedBlock = { position: '1', id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // when
    const result = createBlock('iba', 1);
    // then
    expect(result).toStrictEqual(expectedBlock);
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
    const result = createABlockChain(4);
    // then
    expect(expectedBlockChain).toStrictEqual(result);
  });
});
describe('getLastBlock', () => {
  it('returns a genesis block when the target is a one element blockchain', () => {
    const blockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }];
    // given
    const expectedGenesisBlock = { position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' };
    // when
    const result = getLastBlock(blockChain);
    // then
    expect(result).toStrictEqual(expectedGenesisBlock);
  });
  it('returns the last element(with previousBlockId) of (multi-element) blockchain', () => {
    // given
    const testedBlockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '1', id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '2', id: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', previousBlockId: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' }, { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }];
    const expectedLastBlock = { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' };
    // when
    const result = getLastBlock(testedBlockChain);
    // then
    expect(expectedLastBlock).toStrictEqual(result);
  });
});

describe('isIntegrous', () => {
  it('returns false when a previousblockId of a given block does not match with the id of the corresponding previous block ', () => {
    const testedBlockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '1', id: '6b86b273ff34fce19d6oupsosszasasab804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '2', id: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', previousBlockId: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' }, { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }];
    // given
    const expectedResponse = false;
    // when
    const result = isIntegrous(testedBlockChain);
    // then
    expect(expectedResponse).toStrictEqual(result);
  });
  it('returns true when ALL previousblockId of given blocks match with ids of previous block', () => {
    // given
    const testedBlockChain = [{ position: '0', id: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '1', id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', previousBlockId: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9' }, { position: '2', id: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', previousBlockId: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' }, { position: '3', id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', previousBlockId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }];
    const expectedResponse = true;
    // when
    const result = isIntegrous(testedBlockChain);
    // then
    expect(expectedResponse).toStrictEqual(result);
  });
});
