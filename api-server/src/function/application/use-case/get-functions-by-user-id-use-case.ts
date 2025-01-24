import { Injectable } from '@nestjs/common';
import { MongoFaasFunctionRepository } from 'src/function/infrastructure/database/mongo-faasfunction-repository';
import { GetFunctionsByUserIdResponse} from '../response/get-functions-by-user-id-response'; 
import { GetFunctionsByUserIdQuery } from '../query/get-functions-by-user-id-query';

@Injectable()
export class GetFunctionsByUserIdUseCase {
  constructor(private readonly repository: MongoFaasFunctionRepository) {}

  async execute(command: GetFunctionsByUserIdQuery): Promise<GetFunctionsByUserIdResponse[]> {
    try {
      const functions = await this.repository.findByUserId(command.userId);
      if (!functions) {
        throw new Error("No functions found for the given userId");
      }

      // Mapeamos las funciones para devolver el id y el nombre en el formato correcto
      const result = functions.map(func => 
        GetFunctionsByUserIdResponse.of(func.id, func.image) // Creamos una respuesta con id y name
      );

      return result;
    } catch (error) {
      console.error("Error en GetFunctionsByUserIdUseCase:", error);
      throw error; 
    }
  }
}