import { Module } from '@nestjs/common';
import { FeedService } from './services/feed/feed.service';
import { FeedController } from './controllers/feed/feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entity';
import { UserEntity } from 'src/auth/models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FeedPostEntity, UserEntity])],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController],
})
export class FeedModule {}
