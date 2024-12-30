import { User } from '../model/user';

export interface UserRepository {
  save(user: User): Promise<User>;
  delete(user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
}