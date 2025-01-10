import { FaasFunction } from '../model/faasfunction';

export interface FaasFunctionRepository {
  save(func: FaasFunction): Promise<FaasFunction>;
  delete(func: FaasFunction): Promise<FaasFunction>;
  findByUserId(userId: string): Promise<FaasFunction[] | null>;
  findById(id: string): Promise<FaasFunction | null>;
  findByUserIdAndImage(
    userId: string,
    image: string,
  ): Promise<FaasFunction | null>;
}
