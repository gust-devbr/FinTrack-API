import { type UserPayload } from '@/modules/auth/types/user-payload';
import 'multer';

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}

export {};
