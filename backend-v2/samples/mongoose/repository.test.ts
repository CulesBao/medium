import { describe, beforeEach, it, expect, beforeAll } from '@jest/globals';
import { faker } from '@faker-js/faker';
import * as mongoDBTestContainer from '@testcontainers/mongodb';
import mongoose from 'mongoose';
import { UserRepository } from './repository';
import { Db, DeleteResult, MongoClient, ObjectId } from 'mongodb';
import { User } from '../api/types';

describe('Repository suite test', () => {
  let mongodbContainer: mongoDBTestContainer.StartedMongoDBContainer;
  let userRepository: UserRepository;
  let rawMongoDBConnection: Db;
  let dbName: string;

  beforeAll(async () => {
    dbName = 'testrepository';
    mongodbContainer = await new mongoDBTestContainer.MongoDBContainer('mongo:6.0.1').start();
    await mongoose.connect(mongodbContainer.getConnectionString(), { directConnection: true, dbName });
    const client = new MongoClient(mongodbContainer.getConnectionString() + '?directConnection=true');

    rawMongoDBConnection = client.db(dbName);
    await rawMongoDBConnection.command({ ping: 1 });
  }, 1000 * 100);

  beforeEach(() => {
    userRepository = new UserRepository();
  })
  it('Should insert user to the database', async () => {
    const userCreationDto = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const user = await userRepository.create(userCreationDto);

    // Check the returned result.
    expect(user).toBeTruthy();
    expect(user.id).toBeTruthy();
    expect(user.name).toEqual(userCreationDto.name);
    expect(user.email).toEqual(userCreationDto.email);

    // Check in database
    const doc = await rawMongoDBConnection.collection('users')
      .findOne({ _id: new ObjectId(user.id) });

    expect(doc).toBeTruthy();
    expect(doc?.name).toEqual(userCreationDto.name);
    expect(doc?.email).toEqual(userCreationDto.email);
  });

  it('Should delete user from the database', async () => {
    const userCreationDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const user = await rawMongoDBConnection.collection('users')
      .insertOne(userCreationDto);

    const id = user.insertedId;

    expect(id).toBeTruthy();

    const deleteResult: DeleteResult = await userRepository.deleteOneById(String(id));
    expect(deleteResult.deletedCount).toEqual(1);
    expect(deleteResult.acknowledged).toBeTruthy();
  });

  it('Should get one from the database', async () => {
    const userCreationDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const user = await rawMongoDBConnection.collection('users')
      .insertOne(userCreationDto);

    const id = user.insertedId;

    expect(id).toBeTruthy();

    const doc = await userRepository.getOneById(String(id))

    expect(doc).toBeTruthy();
    expect(doc?.name).toEqual(userCreationDto.name);
    expect(doc?.email).toEqual(userCreationDto.email);
  });

  it('Should get all from the database', async () => {
    const findAllResult: User[] = await userRepository.getAll()
    expect(findAllResult.length).toBeGreaterThanOrEqual(2)
  });
});