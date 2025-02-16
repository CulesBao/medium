import { User, IUserRepository, UserCreationDto } from '../api/types';
import UserModel from './model';
import bcrypt from 'bcrypt';

export class UserServiceImpl implements IUserRepository  {

  async create(dto: UserCreationDto): Promise<User> {
    const createResult = await UserModel.create(dto)
    dto.password = bcrypt.hashSync(dto.password, 10)
    return {
      id: String(createResult._id),
      name: createResult.name,
      email: createResult.email,
      createdAt: createResult.createdAt
    }
  }

  async getOneById(id: string): Promise<User | null> {
    const getOneByIdResult = await UserModel.findById(id)
    if (!getOneByIdResult)
      throw new Error(`User with id ${id} not found`)
    return {
      id: String(getOneByIdResult._id),
      name: getOneByIdResult.name,
      email: getOneByIdResult.email,
    }
  }

  async getAll(): Promise<User[]> {
    const getAllResult = await UserModel.find()
    return getAllResult.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
    }))
  }

}