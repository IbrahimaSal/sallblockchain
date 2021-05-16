import { block } from './block';

const getLastBlock = (blockChain:block[]) => blockChain[blockChain.length];
export default getLastBlock;
