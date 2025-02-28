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
    const followingUser = await UserModel.findById(followingId)
    const followerUser = await UserModel.findById(followerId)
    if (!followingUser || !followerUser) {
      throw new Error('User not found');
    }
    if (!followingUser.followers.includes(followerUser._id) || !followerUser.followings.includes(followingUser._id)) {
      throw new Error('User not followed');
    }
    followingUser.followers = followingUser.followers.filter((id) => String(id) != followerId);
    followerUser.followings = followerUser.followings.filter((id) => String(id) != followingId);
    console.log(followingUser.followers);
    console.log(followerUser.followings);
    await followingUser.save();
    await followerUser.save();
  }
  async getFollowers(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id).populate({
      path: 'followers',
      select: 'id email name avatar'
    }).exec();
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
    const user = await UserModel.findById(id).populate({
      path: 'followings',
      select: 'id email name avatar'
    }).exec();
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