import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import {
    RegisterDto,
    VerifyOtpDto,
    AddRoleDto,
} from '../dtos/auth.register.dto';
import {
    AuthResponseDto,
    SendOtpResponseDto,
    AddRoleResponseDto,
} from '../dtos/auth.response.dto';
import { OtpIntent } from '../dtos/auth.send-otp.dto';

export interface IAuthService {
    refreshTokens(payload: IAuthUser): Promise<{ accessToken: string }>;
    sendOtp(phone: string, intent: OtpIntent): Promise<SendOtpResponseDto>;
    verifyOtpOnly(data: VerifyOtpDto): Promise<{ success: boolean }>;
    register(data: RegisterDto): Promise<AuthResponseDto>;
    signin(data: VerifyOtpDto): Promise<AuthResponseDto>;
    addRole(
        data: AddRoleDto,
        authenticatedUserId: string
    ): Promise<AddRoleResponseDto>;
}
