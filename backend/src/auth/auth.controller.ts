/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!name || !email || !password) {
      throw new HttpException(
        {
          success: false,
          message: 'Please provide valid input',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Define the regex pattern for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the regex pattern
    if (!emailRegex.test(email)) {
      throw new HttpException(
        {
          success: false,
          message: 'Invalid email format',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const duplicate_user = await this.authService.findOne({ email });

    if (duplicate_user) {
      throw new HttpException(
        {
          success: false,
          message: 'Email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Check if the password matches the regex pattern
    if (!passwordRegex.test(password)) {
      throw new HttpException(
        {
          success: false,
          message:
            'Invalid password format. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 12);

    const user = await this.authService.register({
      name,
      email,
      password: hashedPassword,
    });

    const { password: hashed, ...result } = user;

    return {
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  }
}
