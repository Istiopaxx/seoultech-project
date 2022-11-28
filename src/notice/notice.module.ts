import { Notice, NoticeSchema } from './entity/notice.entitiy';
import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { NoticeRepository } from './notice.repository';
import { MongooseModule, Schema } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notice.name,
        schema: NoticeSchema,
      },
    ]),
  ],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository],
})
export class NoticeModule {}
