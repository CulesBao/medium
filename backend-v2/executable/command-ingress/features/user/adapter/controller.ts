import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { UserService } from '../types';
import { Response, NextFunction } from 'express';

export class UserController extends BaseController {
  service: UserService;

  constructor(service: UserService) {
    super();
    this.service = service;
  }

  async getOne(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const user = await this.service.getOne(id);
      res.status(200).json(user);
      return;
    });
  }
  async followUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const followingId = req.params.id;
      const followerId = req.getSubject();
      await this.service.followUser(followingId, followerId);
      res.status(200).json({
        message: 'user followed',
      });
      return;
    });
  }
  async unfollowUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const followingId = req.params.id;
      const followerId = req.getSubject();
      await this.service.unfollowUser(followingId, followerId);
      res.status(200).json({
        message: 'user unfollowed',
      });
      return;
    });
  }
  async getFollowers(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const followers = await this.service.getFollowers(id);
      res.status(200).json(followers);
      return;
    });
  }
  async getFollowing(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const followings = await this.service.getFollowing(id);
      res.status(200).json(followings);
      return;
    });
  }
}