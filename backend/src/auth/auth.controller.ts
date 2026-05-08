// Import the decorators and utilities we need from NestJS
// Body: allows us to read the data sent in the request body
// Controller: defines this class as a controller
// Post: defines an HTTP POST route
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
// Import the AuthService, where the authentication logic will be handled
import { AuthService } from './auth.service';

// This decorator defines the base route for this controller.
// In this case, all routes inside this controller will start with /auth
@Controller('auth')
export class AuthController {
// The constructor injects the AuthService into this controller.
  // "private readonly" means:
  // - private: it can only be used inside this class
  // - readonly: it cannot be reassigned after being initialized
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
