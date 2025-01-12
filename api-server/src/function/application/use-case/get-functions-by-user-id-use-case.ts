import { GetFunctionsByUserIdCommand } from '../command/get-functions-by-user-id-command';
import { FaasFunctionRepository } from '../../domain/repository/faasfunction-repository';

export class GetFunctionsByUserIdUseCase {
    constructor(private readonly repository: FaasFunctionRepository) {}

    async execute(command: GetFunctionsByUserIdCommand): Promise<string[]> {
        const functions = await this.repository.findByUserId(command.userId);
        return functions.map(func => func.id);
    }
}