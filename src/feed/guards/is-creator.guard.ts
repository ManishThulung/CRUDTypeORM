import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed/feed.service';
import { User } from 'src/auth/models/user.interface';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log('requestt', request);

    const { user, params } = request;
    // console.log('user', user?.userId);
    // console.log('params', params?.id);

    if (!user || !params) return false;

    if (user.role === 'admin') return true; // admin can do anything

    const userId = user.userId;
    const feedId = params.id;

    const existUser = await this.userService.findUserById(userId);
    const existFeedPost = await this.feedService.findPostById(feedId);

    if (existUser.id === existFeedPost.author.id) return true;
    return false;
  }
}
