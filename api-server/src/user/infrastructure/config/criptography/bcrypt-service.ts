import { Injectable } from '@nestjs/common';
import { CryptographyService } from '../../../application/service/cryptography-service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements CryptographyService {
  private readonly iterations: number = 10;
  constructor(private readonly configService: ConfigService) {}

  async encrypt(data: string): Promise<string> {
    let saltingWord = this.configService.get('SALTING_WORD');
    const salt = await bcrypt.genSalt(this.iterations, 'a');
    return bcrypt.hash(data + saltingWord, salt);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    const saltingWord = this.configService.get('SALTING_WORD'); // Recuperar el mismo saltingWord usado en encrypt
    return bcrypt.compare(password + saltingWord, hash); // Concatenar saltingWord antes de comparar
  }
}
