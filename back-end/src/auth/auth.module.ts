import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UserModule,
    MailModule,

    ConfigModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
