import { Injectable } from '@nestjs/common';
import { GetFunctionsByUserIdCommand } from '../command/get-functions-by-user-id-command';
import { MongoFaasFunctionRepository } from 'src/function/infrastructure/database/mongo-faasfunction-repository';
import { GetUserByIdResponse } from '../response/get-functions-by-user-id-response'; 

@Injectable()
export class GetFunctionsByUserIdUseCase {
  constructor(private readonly repository: MongoFaasFunctionRepository) {}

  async execute(command: GetFunctionsByUserIdCommand): Promise<GetUserByIdResponse[]> {
    try {
      const functions = await this.repository.findByUserId(command.userId);
      if (!functions) {
        throw new Error("No functions found for the given userId");
      }

      // Mapeamos las funciones para devolver el id y el nombre en el formato correcto
      const result = functions.map(func => 
        GetUserByIdResponse.of(func.id, func.image) // Creamos una respuesta con id y name
      );

      console.log("Funciones encontradas:", result);

      return result;
    } catch (error) {
      console.error("Error en GetFunctionsByUserIdUseCase:", error);
      throw error; 
    }
  }
}