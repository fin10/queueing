import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QueueingLogger extends Logger {}
