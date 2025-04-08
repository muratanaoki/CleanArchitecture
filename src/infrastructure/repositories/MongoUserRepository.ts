import { Service } from 'typedi';
import { Collection } from 'mongodb';
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/valueObjects/UserId';
import { Email } from '../../domain/valueObjects/Email';
import { Password } from '../../domain/valueObjects/Password';
import { Role } from '../../domain/valueObjects/Role';
import { UserRepository } from '../../application/ports/repositories/UserRepository';
import { MongoDBConnection } from '../database/mongodb/connection';

interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Service()
export class MongoUserRepository implements UserRepository {
  private collection: Collection<UserDocument>;

  constructor() {
    const db = MongoDBConnection.getInstance().getDb();
    this.collection = db.collection<UserDocument>('users');
  }

  public async findById(id: UserId): Promise<User | null> {
    const document = await this.collection.findOne({ _id: id.getValue() });
    
    if (!document) {
      return null;
    }
    
    return this.mapToEntity(document);
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const document = await this.collection.findOne({ email: email.getValue() });
    
    if (!document) {
      return null;
    }
    
    return this.mapToEntity(document);
  }

  public async save(user: User): Promise<void> {
    const document = this.mapToDocument(user);
    
    await this.collection.updateOne(
      { _id: document._id },
      { $set: document },
      { upsert: true }
    );
  }

  public async delete(id: UserId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private mapToEntity(document: UserDocument): User {
    return User.reconstitute({
      id: UserId.fromString(document._id),
      name: document.name,
      email: Email.create(document.email),
      password: Password.fromHashed(document.password),
      role: Role.create(document.role),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    });
  }

  private mapToDocument(user: User): UserDocument {
    const userObj = user.toObject();
    
    return {
      _id: userObj.id.getValue(),
      name: userObj.name,
      email: userObj.email.getValue(),
      password: userObj.password,
      role: userObj.role.getValue(),
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt
    };
  }
}
