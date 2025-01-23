export class GetFunctionsByUserIdResponse {
    private readonly id: string;
    private readonly name: string;
  
    private constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  
    static of(id: string, name: string): GetFunctionsByUserIdResponse {
      return new GetFunctionsByUserIdResponse(id, name);
    }
}