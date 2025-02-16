type User = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

type UserCreationDto = {
  email: string;
  name: string;
  password: string;
  createdAt?: string;
};

interface IUserRepository {
  create(dto: UserCreationDto): Promise<User>;
  getAll(): Promise<User[]>;
  getOneById(id: string): Promise<User | null>;
}

export {
  IUserRepository,
  UserCreationDto,
  User,
}