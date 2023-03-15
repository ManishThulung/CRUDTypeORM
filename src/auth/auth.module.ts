import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './guards/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      // useFactory: () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
      // }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
