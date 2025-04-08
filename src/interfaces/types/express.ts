import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
    isAdmin: boolean;
  };
  body: any;
  params: {
    [key: string]: string;
  };
}
