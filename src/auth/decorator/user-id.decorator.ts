import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const userId = context.switchToHttp().getRequest().user._id.toString();
    return userId;
  },
);
