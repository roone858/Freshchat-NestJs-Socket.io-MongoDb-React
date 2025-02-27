import { CryptoService } from '../../../lib/crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export type Permission = 'GET' | 'CREATE' | 'UPDATE' | 'DELETE';
export class CASL {
  [index: string]: { id: string; actions: Permission[] }[];
}
@Schema()
export class Geo {
  @Prop({ required: true })
  lat: string;

  @Prop({ required: true })
  lng: string;
}
@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  suite: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zipcode: string;

  @Prop({ type: Geo, required: true })
  geo: Geo;
}

@Schema({ collection: 'User' })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '/default.png' })
  image: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  website: string;

  @Prop({ default: {}, type: CASL })
  casl: CASL;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  teamId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, default: null }) // Reset code (optional)
  resetPasswordCode?: string;

  @Prop({ type: Date, default: null }) // Expiry time (optional)
  resetPasswordExpires?: Date;

  @Prop({ type: String, default: null }) // Explicitly set type to String
  socketId: string | null;

  @Prop({ type: Date, default: null }) // Expiry time (optional)
  lastSeen?: Date;

  isPasswordCorrect: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Check if the given password equals the user password.
 */
UserSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return CryptoService.compare(password, this.password);
};
