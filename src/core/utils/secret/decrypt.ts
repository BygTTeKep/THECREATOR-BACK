import { ALGORITHM, IV_LENGTH } from './constants';
import { getKey } from './getKey';
import * as crypto from 'crypto';

export const decrypt = (payload: string, secret: string): string => {
  const key = getKey(secret);
  const data = Buffer.from(payload, 'base64');

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16); // GCM authTag всегда 16 байт
  const encrypted = data.subarray(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};
