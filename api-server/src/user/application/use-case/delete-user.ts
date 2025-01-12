import { DeleteUserCommand } from '../command/delete-user-command';
import { UserRepository } from '../../domain/repository/user-repository';

export class DeleteUser {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: DeleteUserCommand): Promise<void> {
        const user = await this.userRepository.findById(command.userId);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(user);
    }
}