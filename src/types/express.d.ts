import { IAuthUser } from '../common/request/interfaces/request.interface';

declare global {
    namespace Express {
        interface Request {
            user?: IAuthUser;
        }
    }
}

export {};
