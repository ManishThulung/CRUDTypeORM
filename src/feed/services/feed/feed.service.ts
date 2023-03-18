import { Injectable, UseGuards } from '@nestjs/common';
import { FeedPostEntity } from 'src/feed/models/post.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPost } from 'src/feed/models/post.interface';
import { Observable, from } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/auth/models/user.interface';
import { UserEntity } from 'src/auth/models/user.entity';
@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createPost(user: User, feedPost: FeedPost) {
    const { email } = user;
    const userDetail = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    feedPost.author = userDetail;
    return from(this.feedPostRepository.save(feedPost));
  }

  getPosts(): Observable<FeedPost[]> {
    return from(this.feedPostRepository.find());
  }

  updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
    return from(this.feedPostRepository.update(id, feedPost));
    // return from(this.feedPostRepository.update({id}, {...feedPost}));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }

  findPosts(take: number, skip: number): Observable<FeedPost[]> {
    return from(
      this.feedPostRepository.findAndCount({ take, skip }).then(([posts]) => {
        return <FeedPost[]>posts;
      }),
    );
  }

  async findPostById(id: number) {
    const post = await this.feedPostRepository.findOne({
      where: {
        id: id,
      },
      relations: ['author'],
    });
    return post;
  }
}
