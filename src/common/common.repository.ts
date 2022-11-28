import { Model } from 'mongoose';

export abstract class CommonRepository<Entity, CreateDto, UpdateDto> {
  private model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async create(createEntityDto: CreateDto, userId: string): Promise<Entity> {
    const createdCommon = new this.model({
      ...createEntityDto,
      authorId: userId,
    });
    return await createdCommon.save();
  }

  async findAll(): Promise<Entity[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Entity> {
    return await this.model.findById(id).exec();
  }

  async update(id: string, updateEntityDto: UpdateDto): Promise<Entity> {
    return await this.model
      .findOneAndUpdate({ id }, updateEntityDto, { new: true })
      .exec();
  }
  async remove(id: string): Promise<Entity> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
