import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  private blockedFields: (keyof User)[] = ['email', 'password', 'username'];

  unpopulatedFields = '-' + this.blockedFields.join(' -');
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getUserByName(name: string) {
    const username = { $regex: new RegExp(`^${name}$`, 'i') };
    return this.userModel.findOne({ username });
  }

  async validateUserByName(username: string) {
    const user = await this.getUserByName(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getUserByEmail(mail: string) {
    const email = { $regex: new RegExp(`^${mail}$`, 'i') };
    return this.userModel.findOne({ email });
  }

  async validateUserByEmail(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async validateUserById(id: string) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUser(username: string) {
    return (
      (await this.getUserByEmail(username)) ??
      (await this.getUserByName(username))
    );
  }

  async getAllUsers() {
    return this.userModel.find();
  }

  filterUser(user: User, allowedFields: (keyof User)[] = []) {
    const userObj = user.toObject({ virtuals: true });
    for (const field of this.blockedFields) {
      if (allowedFields.includes(field)) {
        continue;
      }
      delete userObj[field];
    }
    return userObj;
  }

  async create(body: Partial<User>) {
    const user = await this.userModel.create(body);
    return user.save();
  }
}
