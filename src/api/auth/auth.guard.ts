import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomGuard extends AuthGuard('custom') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
