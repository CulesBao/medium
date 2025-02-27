import { UserEntity, UserService } from '../types';
import UserModel from '../../../../../internal/model/user';

export class UserServiceImpl implements UserService {
  async followUser(followingId: string, followerId: string): Promise<void> {
    const followingUser = await UserModel.findById(followingId);
    const followerUser = await UserModel.findById(followerId);
    if (!followingUser || !followerUser) {
      throw new Error('User not found');
    }
    if (followingUser.followers.includes(followerUser._id) || followerUser.followings.includes(followingUser._id)) {
      throw new Error('User already followed');
    }
    followingUser.followers.push(followerUser._id);
    followerUser.followings.push(followingUser._id);
    await followingUser.save();
    await followerUser.save();
  }
  async unfollowUser(followingId: string, followerId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getFollowers(id: string): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  async getFollowing(id: string): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
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