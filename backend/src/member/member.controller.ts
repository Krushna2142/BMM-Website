import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    return this.memberService.findAll({
      category,
      // ✅ Only pass isActive when it's actually provided
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      search,
    });
  }

  @Get('public')
  async findPublicMembers(@Query('category') category?: string) {
    return this.memberService.findAll({
      category,
      isActive: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any) {
    return this.memberService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.memberService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  async bulkCreate(@Body() members: any[]) {
    return this.memberService.bulkCreate(members);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body() body: { ids: string[] }) {
    return this.memberService.reorder(body.ids);
  }
}