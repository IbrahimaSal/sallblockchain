/* eslint-disable import/prefer-default-export */
import { SHA256 } from 'crypto-js';

export const encodeSHA256 = (str) => SHA256(str.toString()).toString();
