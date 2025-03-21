import { NextFunction, Request, Response } from 'express';

const recoverMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'internal server error',
  });
};

export {
  recoverMiddleware,
};
