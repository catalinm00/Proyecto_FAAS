export interface CryptographyService {
  encrypt(data: string): Promise<string>;
}