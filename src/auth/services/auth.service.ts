import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash) {
    return await bcrypt.compare(password, hash);
  }

  async registerAccoutnt(user: User) {
    const { firstName, lastName, email, password } = user;
    const hashedPassword = await this.hashPassword(password);
    return await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      const checkIfCorrectPassword = await this.comparePassword(
        pass,
        user.password,
      );
      if (!checkIfCorrectPassword)
        throw new HttpException('invalid Credential', HttpStatus.BAD_REQUEST);
      const { password, ...results } = user;
      return results;
    } else {
      throw new HttpException('invalid Credentialsss', HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: any) {
    // const payload = {
    //   email: user.email,
    //   password: user.password,
    //   userId: user.id,
    // };
    // console.log('user', user);

    return {
      access_token: this.jwtService.sign(user, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
