import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { FeedPost } from 'src/feed/models/post.interface';
import { FeedService } from 'src/feed/services/feed/feed.service';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';

@Controller('feed')
export class FeedController {
  constructor(private feedServices: FeedService) {}

  @Post('create')
  create(@Body() post: FeedPost): Observable<FeedPost> {
    return this.feedServices.createPost(post);
  }

  @Get('all')
  getAll(): Observable<FeedPost[]> {
    return this.feedServices.getPosts();
  }

  @Get()
  findSelected(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
  ): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedServices.findPosts(take, skip);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
  ): Observable<UpdateResult> {
    return this.feedServices.updatePost(id, feedPost);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedServices.deletePost(id);
  }
}
