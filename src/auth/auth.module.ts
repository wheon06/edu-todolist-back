import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
