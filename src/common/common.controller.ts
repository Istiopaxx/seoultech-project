import { Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserId } from 'src/auth/decorator/user-id.decorator';

export abstract class CommonController<CreateCommonDto, UpdateCommonDto> {
  constructor(private commonService: any) {
    this.commonService = commonService;
  }

  @Post()
  async create(
    @UserId() userId: string,
    @Body() createCommonDto: CreateCommonDto,
  ) {
    return await this.commonService.create(createCommonDto, userId);
  }

  @Get()
  findAll() {
    return this.commonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommonDto: UpdateCommonDto) {
    return this.commonService.update(id, updateCommonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonService.remove(id);
  }
}
