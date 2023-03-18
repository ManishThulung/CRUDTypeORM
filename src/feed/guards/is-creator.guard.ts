import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed/feed.service';
import { User } from 'src/auth/models/user.interface';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private feedService: FeedService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log('requestt', request);

    const { user, params } = request;
    // console.log('user', user?.userId);
    // console.log('params', params?.id);

    if (!user || !params) return false;

    if (user.role === 'admin') return true;

    const userId = user.userId;
    const feedId = params.id;

    const existUser = await this.authService.findUserById(userId);
    const existFeedPost = await this.feedService.findPostById(feedId);

    if (existUser.id === existFeedPost.author.id) return true;
    return false;
  }
}
