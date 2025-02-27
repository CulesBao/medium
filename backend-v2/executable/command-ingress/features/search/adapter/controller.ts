import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { Response, NextFunction } from 'express';
import { SearchService } from '../types';
export class SearchController extends BaseController {
    searchService: SearchService;
    constructor(private service: SearchService) {
        super();
        this.searchService = service;
    }
    async postSearch(req: HttpRequest, res: Response, next: NextFunction) {
        await this.execWithTryCatchBlock(req, res, next, async (req: HttpRequest, res: Response, _next: NextFunction) => {
            const { query } = req.params;
            const posts = await this.service.postSearch(query);
            res.status(200).json(posts);
            return;
        });
    }
    async topicSearch(req: HttpRequest, res: Response, next: NextFunction) {
        await this.execWithTryCatchBlock(req, res, next, async (req: HttpRequest, res: Response, _next: NextFunction) => {
            const { query } = req.params;
            const topics = await this.service.topicSearch(query);
            res.status(200).json(topics);
            return;
        });
    }
    async userSearch(req: HttpRequest, res: Response, next: NextFunction) {
        await this.execWithTryCatchBlock(req, res, next, async (req: HttpRequest, res: Response, _next: NextFunction) => {
            const { query } = req.params;
            const users = await this.service.userSearch(query);
            res.status(200).json(users);
            return;
        });
    }
}