export class GetUserByIdResponse {
    private readonly id: string;
    private readonly name: string;
  
    private constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  
    static of(id: string, name: string): GetUserByIdResponse {
      return new GetUserByIdResponse(id, name);
    }
}