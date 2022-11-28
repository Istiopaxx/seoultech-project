import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommonController } from 'src/common/common.controller';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/create-notice.dto';
import { NoticeService } from './notice.service';

@ApiTags('Notice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notice')
export class NoticeController extends CommonController<
  CreateNoticeDto,
  UpdateNoticeDto
> {
  constructor(private readonly noticeService: NoticeService) {
    super(noticeService);
  }
}
