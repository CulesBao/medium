import express, { Router } from 'express';
import { SearchController } from './controller';
const router = express.Router();

const setupUserRoute = (controller: SearchController): Router => {
    router.route('/posts/:query').post(controller.postSearch.bind(controller));
    router.route('/users/:query').post(controller.userSearch.bind(controller));
    // router.route('/topics/:query').post(controller.topicSearch.bind(controller));
    return router;
}
export default setupUserRoute;
