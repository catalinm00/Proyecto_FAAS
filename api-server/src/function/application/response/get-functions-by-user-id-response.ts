export class GetFunctionsByUserIdResponse {
    private readonly success: boolean;
    private readonly data: string[];

    constructor(functionIds: string[]) {
        this.success = true;
        this.data = functionIds;
    }
}