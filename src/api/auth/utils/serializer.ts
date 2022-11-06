import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { ValidateUserDto } from '../dto/validate-user.dto';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: any) => void): any {
    console.log('Serializer User');
    done(null, user);
  }

  async deserializeUser(
    payload: User,
    done: (err: Error, payload: ValidateUserDto) => void,
  ): Promise<any> {
    console.log('Deserialize User');
    const user = await this.authService.validateUser(payload);
    done(null, user);
  }
}
