import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../user/entities/user.entity';

export class ValidateUserDto extends PartialType(User) {
  firstName: string;
  lastName: string;
  email: string;
  profileImgUrl: string;
}
