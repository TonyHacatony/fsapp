import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  LoginTicket,
  OAuth2Client,
  TokenPayload as GooglePayload,
} from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  googleClient: OAuth2Client;
  constructor() {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );
  }

  async getGooglePayload(tokenId: string): Promise<GooglePayload> {
    try {
      const ticket: LoginTicket = await this.googleClient.verifyIdToken({
        idToken: tokenId,
      });
      return ticket.getPayload();
    } catch (error) {
      throw new UnauthorizedException('Invalid - google id token');
    }
  }
}
