import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserDocument.name) private UserModel: Model<UserDocument>,
  ) {}
  create(user: Partial<UserDocument>): Promise<UserDocument> {
    return this.UserModel.create(user);
  }
  getAllUsers(): Promise<UserDocument[]> {
    return this.UserModel.find().exec();
  }
  getById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id).exec();
  }
  getByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email }).exec();
  }
  async updateById(
    id: string,
    data: Partial<UserDocument>,
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user id');
    }

    const user = await this.UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
        strict: 'throw',
      },
    ).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  deleteById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findByIdAndDelete(id).exec();
  }
  async existsByEmail(email: string): Promise<boolean> {
    const user = this.UserModel.exists({ email });
    const result = await user;
    return result !== null;
  }
  updatePassword(
    id: string,
    passwordHash: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findByIdAndUpdate(
      id,
      { passwordHash },
      { new: true },
    ).exec();
  }
  updateRoles(id: string, roles: string[]): Promise<UserDocument | null> {
    return this.UserModel.findByIdAndUpdate(
      id,
      { roles },
      { new: true },
    ).exec();
  }
}
