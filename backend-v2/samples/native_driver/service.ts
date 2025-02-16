import { Db, ObjectId, WithId, Document } from 'mongodb';
import { User, IUserRepository, UserCreationDto } from '../api/types';

export class UserServiceImpl implements IUserRepository {
  // dependencies
  db: Db;

  // constructor
  constructor(db: Db) {
    this.db = db;
  }

  async create(dto: UserCreationDto): Promise<User> {
    const {
      name, email
    } = dto
    const insertOneResult = await this.db.collection('users')
      .insertOne({
        name, email
      })
    const id = insertOneResult.insertedId
    return {
      id: String(id),
      name,
      email
    }
  }

  async getOneById(id: string): Promise<User | null> {
    const getOneByIdResult: WithId<Document> | null = await this.db.collection('users')
      .findOne({
        _id: new ObjectId(id)
      })
    if (!getOneByIdResult)
      throw new Error(`User with id ${id} not found.`)
    return {
      id: getOneByIdResult._id.toString(),
      name: getOneByIdResult.name,
      email: getOneByIdResult.email
    }
  }

  async getAll(): Promise<User[]> {
    const getAllResult: WithId<Document>[] = await this.db.collection('users')
      .find()
      .toArray()
    return getAllResult.map((user: WithId<Document>) => {
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email
    }})
  }

}