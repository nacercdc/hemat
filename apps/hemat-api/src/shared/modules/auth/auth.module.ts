import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AbilityService, AuthService } from './services';
import { AuthStrategy, AuthRefreshStrategy } from './strategies';
import { AuthGuard, AuthRefreshGuard } from './guards';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    AuthStrategy,
    AuthRefreshStrategy,
    AuthGuard,
    AuthRefreshGuard,
    AbilityService,
  ],
  exports: [AuthService, AbilityService],
})
export class AuthModule {}
