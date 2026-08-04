import * as crypto from 'crypto';
import { getKey } from './getKey';
import { ALGORITHM, IV_LENGTH } from './constants';

export const encrypt = (text: string, secret: string): string => {
  const key = getKey(secret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // упаковываем iv + authTag + encrypted в одну строку, чтобы удобно было класть в Redis
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
};
