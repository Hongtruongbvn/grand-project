import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { GlobalRoleModule } from 'src/global-role/global-role.module';
import { InterestModule } from 'src/interest/interest.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    GlobalRoleModule,
    InterestModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
