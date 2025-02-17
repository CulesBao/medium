import {NextFunction, Request, Response} from 'express';
import env from '../utils/env';
import ServerError from '../utils/server_error';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
    _id: string;
    iat: number;
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const AuthToken = req.headers['authorization']?.split(' ')[1];
    if (!AuthToken) throw new ServerError(401, 'Unauthorized');
    const decoded = <JWTPayload>jwt.verify(AuthToken, env.JWT_SECRET);
    req['userId'] = decoded._id;
    next();
};

export default isAuthenticated;
