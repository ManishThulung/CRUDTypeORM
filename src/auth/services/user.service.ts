import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['feedPosts'],
    });

    const { password, ...results } = user;
    return results;
  }

  updateUserImageByid(id: number, impagePath: string) {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = impagePath;
    return this.userRepository.update(id, user);
  }

  async findImageNameByUserId(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user.imagePath;
  }
}
