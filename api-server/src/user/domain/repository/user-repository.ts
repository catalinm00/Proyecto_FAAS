import { User } from '../model/user';

export interface UserRepository {
  save(user: User): Promise<User>;
  delete(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}