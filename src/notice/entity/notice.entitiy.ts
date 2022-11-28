import { Common } from './../../common/entity/common-entity';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type NoticeDocument = Notice & Document;

@Schema({
  timestamps: true,
})
export class Notice extends Common {}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
