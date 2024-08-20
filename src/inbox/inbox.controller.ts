import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post()
  create(@Body() createInboxDto: CreateInboxDto) {
    return this.inboxService.create(createInboxDto);
  }

  @Get()
  findAll() {
    return this.inboxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inboxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInboxDto: UpdateInboxDto) {
    return this.inboxService.update(+id, updateInboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inboxService.remove(+id);
  }
}
