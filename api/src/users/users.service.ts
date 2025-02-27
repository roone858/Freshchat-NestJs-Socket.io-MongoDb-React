import {
  Injectable,
  NotFoundException,
  // UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { CryptoService } from '../../lib/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async generateUsers() {
    const users = [];

    for (let i = 1; i <= 20; i++) {
      const passwordHash = await CryptoService.hash(`password${i}`);

      users.push({
        name: `User ${i}`,
        username: `user${i}`,
        email: `user${i}@test.com`,
        password: passwordHash,
        image: `/${i}.png`, // Image names from 1.png to 20.png
        address: {
          street: `Street ${i}`,
          suite: `Suite ${i}`,
          city: `City ${i}`,
          zipcode: `1000${i}`,
          geo: {
            lat: (Math.random() * 180 - 90).toFixed(6),
            lng: (Math.random() * 360 - 180).toFixed(6),
          },
        },
        phone: `+12345678${i}`,
        website: `user${i}.test.com`,
        casl: {},
        teamId: null,
        resetPasswordCode: null,
        resetPasswordExpires: null,
        socketId: null,
        lastSeen: new Date(),
      });
    }

    await this.userModel.insertMany(users);
    console.log('✅ 20 test users inserted successfully!');
  }
  async create(createUserDto: CreateUserDto) {
    const passwordHash = await CryptoService.hash(createUserDto.password);
    const user = new this.userModel({
      ...createUserDto,
      passwordHash,
      teamId: new mongoose.Types.ObjectId(),
      isOwner: true,
    });
    const newUser = await user.save();
    return newUser;
  }
  // Find a user by their socketId
  async findUserBySocketId(socketId: string): Promise<User | null> {
    return this.userModel.findOne({ socketId }).exec();
  }

  // Update user's socket ID and last seen timestamp

  async addMember(
    teamId: any,
    createUserDto: CreateUserDto & { role: 'ADMIN' | 'MEMBER' },
  ) {
    const passwordHash = await CryptoService.hash(createUserDto.password);
    const user = new this.userModel({
      ...createUserDto,
      passwordHash,
      isAdmin: createUserDto.role === 'ADMIN',
      teamId,
    });
    const newUser = await user.save();
    return newUser;
  }

  async removeMember(teamId: any, id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }
    await user.deleteOne();
    return;
  }

  findAll() {
    return this.userModel.find().select('-password -email -phone').lean();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneForUser(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('-password -email -phone')
      .lean();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: any, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      updateUserDto,
    );

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
  async getAllUsersExcept(username: string) {
    return this.userModel
      .find({ username: { $ne: username } })
      .select('username')
      .lean();
  }
  async updateUserSocket(
    usernameOrSocketId: string,
    socketId: string | null,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        $or: [
          { username: usernameOrSocketId },
          { socketId: usernameOrSocketId },
        ],
      },
      { socketId: socketId },
      { new: true },
    );
  }
  async updateUserSocketAndLastSeen(
    usernameOrSocketId: string,
    socketId: string | null,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        $or: [
          { username: usernameOrSocketId },
          { socketId: usernameOrSocketId },
        ],
      },
      { socketId: socketId, lastSeen: new Date() },
      { new: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
