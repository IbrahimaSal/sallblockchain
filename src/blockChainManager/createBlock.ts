import { encodeSHA256 } from './encodeSHA256';
import { block } from './block';

// eslint-disable-next-line import/prefer-default-export
export const createBlock = (element, index) => ((index > 0)
  ? { id: index, hashId: encodeSHA256(index), previousBlock: encodeSHA256(index - 1) }
  : { id: index, hashId: encodeSHA256(0) });
