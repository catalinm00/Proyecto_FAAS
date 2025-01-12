import { ApiProperty } from '@nestjs/swagger';

export class GetFunctionsByUserIdRequest {
    @ApiProperty({
        description: 'User ID to retrieve associated function IDs',
        example: 'user12345',
    })
    userId: string;
}