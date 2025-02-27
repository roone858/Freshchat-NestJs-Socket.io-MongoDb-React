import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../users/schemas/user.schema';
import { CryptoService } from 'lib/crypto';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(user: UserDocument) {
    const payload = {
      sub: user._id,
      ...user,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
  async register(userData: {
    email: string;
    password: string;
    username: string;
    name: string;
  }) {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({
        email: userData.email,
      });
      if (existingUser) {
        throw new NotFoundException(
          `User with Email ${userData.email} already exists.`,
        );
      }

      // Hash the password
      const passwordHash = await CryptoService.hash(userData.password);

      // Create new user
      const newUser = new this.userModel({
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: passwordHash,
      });

      // Save to the database
      await newUser.save();

      // Generate a token for the new user
      const token = this.jwtService.sign({
        sub: newUser._id,
        email: newUser.email,
      });

      return {
        message: 'User registered successfully',
        user: { email: newUser.email, username: newUser.username },
        access_token: token,
      };
    } catch (error) {
      console.error('Error in register:', error);
      throw new InternalServerErrorException('Failed to register user.');
    }
  }

  async forgotPassword(email: string) {
    try {
      // 1. Find user by email
      console.log(`Forgot Password Request for: ${email}`);
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException(`User with Email ${email} not found`);
      }

      // 2. Generate a secure reset token and expiration time (10 min)
      const resetCode = await CryptoService.generateResetCode(); // Secure token
      const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      console.log(
        `Generated Reset Code: ${resetCode}, Expires At: ${resetCodeExpires}`,
      );

      // 3. Save reset token to the database
      const result = await this.userModel.updateOne(
        { email },
        {
          $set: {
            resetPasswordCode: resetCode,
            resetPasswordExpires: resetCodeExpires,
          },
        },
      );
      // Check if update was successful
      if (result.matchedCount === 0) {
        throw new NotFoundException(`User with Email ${email} not found`);
      }

      // 4. Send email with reset link
      await this.mailService.sendResetPasswordEmail(email, resetCode);

      console.log(`Reset Code sent to ${email}`);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw new InternalServerErrorException(
        `User with Email ${email} not found.`,
      );
    }
  }
  async verifyResetCode(data: any) {
    const { email, code } = data;
    const user = await this.userModel.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      throw new NotFoundException({ message: 'Invalid or expired code' });

    return { valid: true };
  }
  async resetPassword(data: any) {
    const { email, code, newPassword } = data;
    console.log(data);
    const user = await this.userModel.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      throw new NotFoundException({ message: 'Invalid or expired code' });

    // Update password and clear reset fields
    const passwordHash = await CryptoService.hash(newPassword.toString());

    // Update user by username and set new password
    const result = await this.userModel.updateOne(
      { email: email }, // Filter by email
      {
        $set: {
          password: passwordHash,
          resetPasswordCode: null,
          resetPasswordExpires: null,
        },
      }, // Update only password
    );

    // Check if any document was matched
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }

    return {
      message: 'Password updated successfully',
      modifiedCount: result.modifiedCount,
    };
  }
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // Ensure you have this in .env
      });

      return decoded; // Return decoded payload (user data)
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    const isPasswordCorrect = user && (await user.isPasswordCorrect(password));
    if (isPasswordCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = JSON.parse(JSON.stringify(user));
      return result;
    }
    return null;
  }
}
