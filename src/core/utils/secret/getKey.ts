import * as crypto from 'crypto';

// secret должен быть 32-байтным ключом (256 бит)
// если у тебя secret — произвольная строка, приводим её к нужной длине через scrypt/hash
export function getKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest(); // 32 байта
}
