import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from '../helper/image.storage';
import { of } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const fileName = file?.fieldname;

    if (!fileName) return of({ error: 'File must be png, jpg/jpeg' });
  }
}
