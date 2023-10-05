import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/user.dto';
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

    const result = newUser.save();
    const { password, ...resultWithoutPassword } = (await result).toJSON();

    return resultWithoutPassword;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async findAll() {
    const users = await this.userModel.find();

    const usersWithoutPassword = users.map((user) => {
      const { password, ...result } = user.toJSON();
      return result;
    });

    return usersWithoutPassword;
  }
}
