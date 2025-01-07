import { FaasFunctionExecution } from '../model/faasfunction-execution';

export interface FaasFunctionExecutionRepository {
  save(execution: FaasFunctionExecution): Promise<FaasFunctionExecution>;
  findById(executionId: string): Promise<FaasFunctionExecution | null>;
  countUnfinished(): Promise<number>;
}