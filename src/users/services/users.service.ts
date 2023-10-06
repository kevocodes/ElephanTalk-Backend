import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: CreateUserDto) {
    const emailUser = await this.findOneByEmail(data.email);
    const usernameUser = await this.findOneByUsername(data.username);

    if (emailUser || usernameUser) {
      const messages = [];
      emailUser && messages.push('Email already exists.');
      usernameUser && messages.push('Username already exists.');
      throw new BadRequestException(messages);
    }

    const newUser = new this.userModel(data);

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;

    return await newUser.save();
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .select('+password');
  }

  async findAll() {
    return this.userModel.find();
  }

  async deleteOneById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return await this.userModel.deleteOne({ _id: id });
  }

  async updateOneById(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const emailUser = await this.findOneByEmail(data.email);
    const usernameUser = await this.findOneByUsername(data.username);

    if (emailUser && emailUser.id != id) {
      throw new BadRequestException('Email already exists.');
    }

    if (usernameUser && usernameUser.id != id) {
      throw new BadRequestException('Username already exists.');
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true },
    );

    return updatedUser;
  }
}
