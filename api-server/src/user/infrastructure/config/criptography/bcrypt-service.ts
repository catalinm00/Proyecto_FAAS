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
    const salt = await bcrypt.genSalt(this.iterations, saltingWord);
    return bcrypt.hash(data, salt);
  }

}