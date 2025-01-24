import { DeleteUserCommand } from '../command/delete-user-command';
import { MongoUserRepository } from 'src/user/infrastructure/database/mongo-user-repository';
import { Injectable } from '@nestjs/common';
import { DeleteUserResponse } from '../response/delete-user-response';
import { UserNotFoundException } from 'src/user/domain/exceptions/user-not-found-exception';



@Injectable()
export class DeleteUser {
    constructor(private readonly userRepository: MongoUserRepository) {}

    async execute(command: DeleteUserCommand): Promise<DeleteUserResponse> {
        const user = await this.userRepository.findById(command.userId);
        if (!user) {
            throw new UserNotFoundException();
        }
        await this.userRepository.delete(user);
        return DeleteUserResponse.of(user);
    } 
}