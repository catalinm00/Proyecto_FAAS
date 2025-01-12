export interface CryptographyService {
  encrypt(data: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
