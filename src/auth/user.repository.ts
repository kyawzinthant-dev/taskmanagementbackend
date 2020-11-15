import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hasPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      // console.log(error.code)
      if (error.code === '23505') {
        //duplication
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateuserPassword(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hasPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
