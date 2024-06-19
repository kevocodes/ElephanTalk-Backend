import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { ToxicityClassificationResult } from '../models/prediction.model';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ToxicityDetectorService {
  private readonly logger = new Logger(ToxicityDetectorService.name);

  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getToxicityClassification(
    text: string,
  ): Promise<ToxicityClassificationResult> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<ToxicityClassificationResult>(
          `${this.config.toxicity.url}/moderate`,
          {
            content: text,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            throw new ServiceUnavailableException(
              'Toxicity service is unavailable.',
            );
          }),
        ),
    );

    return data;
  }
}
