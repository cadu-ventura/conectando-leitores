import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../user/entities/User.schema';
import { AdminDocument } from '../admin/entities/Admin.schema';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserDocument | AdminDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);