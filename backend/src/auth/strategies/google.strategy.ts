// src/auth/strategies/google.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    // Validate user (i.e., save to DB if new)
    const user = await this.authService.validateUser(profile);

    // Add isAdmin flag in memory (doesn't change the DB)
    const userWithAdmin = {
      ...user.toObject(),
      isAdmin: true,  // Treat all logged-in users as admins
    };

    done(null, userWithAdmin);  // Send user with the isAdmin flag
  }
}
