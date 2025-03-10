import { UserEntity, UserService } from '../types';
import UserModel from '../../../../../internal/model/user';
export class UserServiceImpl implements UserService {
  async followUser(followingId: string, followerId: string): Promise<void> {
    const session = await UserModel.startSession();
    session.startTransaction();
    await UserModel.updateOne(
      {
        _id: followingId,
      },
      {
        $addToSet: {
          followers: followerId,
        },
      },
      {
        new: true,
        session: session,
      }
    );
    await UserModel.updateOne(
      {
        _id: followerId,
      },
      {
        $addToSet: {
          followings: followingId,
        },
      },
      {
        new: true,
        session: session,
      }
    );
    await session.commitTransaction();
    session.endSession();
  }
  async unfollowUser(followingId: string, followerId: string): Promise<void> {
    const session = await UserModel.startSession();
    session.startTransaction();
    await UserModel.updateOne(
      {
        _id: followingId,
      },
      {
        $pull: {
          followers: followerId,
        },
      },
      {
        session: session,
      }
    );
    await UserModel.updateOne(
      {
        _id: followerId,
      },
      {
        $pull: {
          followings: followingId,
        },
      },
      {
        session: session,
      }
    );
    await session.commitTransaction();
    session.endSession();
  }
  async getFollowers(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id)
      .populate({
        path: 'followers',
        select: 'id email name avatar',
      })
      .exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user.followers.map((follower: any) => ({
      id: String(follower._id),
      name: String(follower.name),
      avatar: String(follower.avatar),
      email: String(follower.email),
    }));
  }
  async getFollowing(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id)
      .populate({
        path: 'followings',
        select: 'id email name avatar',
      })
      .exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user.followings.map((following: any) => ({
      id: String(following._id),
      name: String(following.name),
      avatar: String(following.avatar),
      email: String(following.email),
    }));
  }
  async getOne(id: string): Promise<UserEntity> {
    const user = await UserModel.findById(id);

    return {
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    };
  }
}
