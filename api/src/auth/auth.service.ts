import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
}
