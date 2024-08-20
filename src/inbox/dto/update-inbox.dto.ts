import { PartialType } from '@nestjs/mapped-types';
import { CreateInboxDto } from './create-inbox.dto';

export class UpdateInboxDto extends PartialType(CreateInboxDto) {}
