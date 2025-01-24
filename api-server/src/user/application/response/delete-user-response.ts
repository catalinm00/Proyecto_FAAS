import { User } from '../../domain/model/user';

export class DeleteUserResponse {
 
    constructor(
        readonly id: string,
        readonly email: string,
        readonly message: string
    ) {}
    
  
    static of(user:User): DeleteUserResponse {
      const message = `User email ${user.email} deleted successfully.`;
      return new DeleteUserResponse(user.id,user.email,message);
    }
  }