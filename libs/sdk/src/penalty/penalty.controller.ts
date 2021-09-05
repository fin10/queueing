import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { UserService } from '../user/user.service';
import { Penalty } from './interfaces/penalty.interface';
import { PenaltyService } from './penalty.service';

@Controller('penalty')
export class PenaltyController {
  constructor(private readonly userService: UserService, private readonly penaltyService: PenaltyService) {}

  @Get(':userId')
  async fetchPenalties(@Param('userId', ParseObjectIdPipe) userId: mongoose.Types.ObjectId): Promise<Penalty[]> {
    const user = await this.userService.findUser({ _id: userId });
    if (!user) throw new NotFoundException(`User not found: ${userId}`);

    return this.penaltyService.fetchPenalties(user);
  }
}
