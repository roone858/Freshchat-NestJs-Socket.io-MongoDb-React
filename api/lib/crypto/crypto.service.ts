import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  HASH_SALT,
  ENCRYPTION_METHOD,
  SECRET_KEY,
  SECRET_IV,
} from './crypto.constants';

export class CryptoService {
  /**
   * Hash the given data with the HASH_SALT constant.
   */
  static async hash(data: string) {
    return bcrypt.hash(data, HASH_SALT);
  }

  /**
   * Check if the given data can be hashed to the given hash.
   */
  static async compare(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }

  static async encrypt(plainText: string) {
    const cipher = crypto.createCipheriv(
      ENCRYPTION_METHOD,
      SECRET_KEY,
      Buffer.from(SECRET_IV, 'hex'),
    );

    const encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);

    return encrypted.toString('hex');
  }

  static async generateResetCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_METHOD,
      SECRET_KEY,
      Buffer.from(SECRET_IV, 'hex'),
    );

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }
}
