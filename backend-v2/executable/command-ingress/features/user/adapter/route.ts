import express from 'express';
import { UserController } from './controller';
import requireAuthorizedUser from '../../../middlewares/auth';

const setupUserRoute = (controller: UserController) => {
    const router = express.Router();

    router.get('/:id', controller.getOne.bind(controller));
    router.put('/follow/:id', requireAuthorizedUser, controller.followUser.bind(controller))
    // router.delete('/:id/unfollow', controller.unfollowUser.bind(controller))
    // router.get('/:id/followers', controller.getFollowers.bind(controller))
    // router.get('/:id/following', controller.getFollowing.bind(controller))
    return router;
}

export default setupUserRoute;
