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
