import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomString } from '../../shared/utils/random-string';
import { createSchemaForClassWithMethods } from '../../shared/utils/create-schema';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password?: string;

  @Prop()
  sessionToken: string;

  generateSessionToken() {
    this.sessionToken = randomString(60);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password || '');
  }
}
export const UserSchema = createSchemaForClassWithMethods(User);

// Update password into hashed password

UserSchema.pre('save', async function (next) {
  const user: User = this as any;

  if (!user.password || user.password.startsWith('$')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});
