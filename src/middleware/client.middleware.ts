import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import Bundler from 'parcel-bundler';
import path from 'path';

@Injectable()
export class ClientMiddleware implements NestMiddleware {
  private readonly bundleHandler: RequestHandler;

  constructor() {
    const entryFile = path.resolve('client', 'index.html');
    const options = { outDir: path.resolve('dist', 'client') };
    this.bundleHandler = new Bundler(entryFile, options).middleware();
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.bundleHandler(req, res, next);
  }
}
