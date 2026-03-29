import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export enum OtpIntent {
    REGISTER = 'register',
    SIGNIN = 'signin',
}

export class SendOtpDto {
    @ApiProperty({
        example: '+911234567890',
        required: true,
    })
    @IsPhoneNumber()
    @IsNotEmpty()
    public phone: string;

    @ApiProperty({
        example: 'register',
        enum: OtpIntent,
        required: true,
        description:
            'Intent of the OTP request - register for new users, signin for existing users',
    })
    @IsEnum(OtpIntent)
    @IsNotEmpty()
    public intent: OtpIntent;
}
