import mongoose from 'mongoose';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { Restriction } from './restriction';
import { ImposePenaltyDto } from './dto/impose-penalty.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';

interface Response {
  readonly userId: string;
  readonly restriction: Restriction;
}

@Controller('user')
export class UserController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Post('penalty/:userId')
  async penalty(
    @Param('userId', ParseObjectIdPipe) userId: mongoose.Types.ObjectId,
    @Body() body: ImposePenaltyDto,
  ): Promise<Response> {
    const { duration, reasons } = body;
    const restriction = await this.penaltyService.impose(userId, duration, reasons);
    return { userId: userId.toHexString(), restriction };
  }
}
