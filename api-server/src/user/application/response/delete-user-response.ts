import { User } from '../../domain/model/user';

export class DeleteUserResponse {
 
    constructor(
        readonly id: string,
        readonly email: string,
    ) {}
    
  
    static of(user:User): DeleteUserResponse {
      return new DeleteUserResponse(user.id,user.email);
    }
  }