export abstract class CommonService<Entity, CreateDto, UpdateDto> {
  constructor(private repository: any) {
    this.repository = repository;
  }

  async create(createDto: CreateDto, userId: string): Promise<Entity> {
    return await this.repository.create(createDto, userId);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    return await this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
