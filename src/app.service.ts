import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'config/app.config';

@Injectable()
export class AppService {
  constructor(
    @Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>,
  ) {}

  getHello(): string {
    return 'Hello World! ' + this.configService.mongo.uri;
  }
}
