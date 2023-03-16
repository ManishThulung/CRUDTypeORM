import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FeedPost } from 'src/feed/models/post.interface';
import { FeedService } from 'src/feed/services/feed/feed.service';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('feed')
export class FeedController {
  constructor(private feedServices: FeedService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  create(@Body() feedPost: FeedPost, @Request() req) {
    return this.feedServices.createPost(req.user, feedPost);
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
