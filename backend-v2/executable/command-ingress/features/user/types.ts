type UserEntity = {
  id: string;
  email: string;
  name: string;
  avatar: string;
}
interface UserService {
  getOne(id: string): Promise<UserEntity>;
  followUser(followingId: string, followerId: string): Promise<void>;
  unfollowUser(followingId: string, followerId: string): Promise<void>;
  getFollowers(id: string): Promise<UserEntity[]>;
  getFollowing(id: string): Promise<UserEntity[]>;
}

export {
  UserEntity,
  UserService
};
