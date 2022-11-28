import { Prop } from '@nestjs/mongoose';

export class Common {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  authorId: number;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  imageUrl: string[];
  @Prop({ required: false })
  createdAt: Date;
  @Prop({ required: false })
  updatedAt: Date;
}
