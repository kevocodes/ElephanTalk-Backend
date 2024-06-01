import { Module } from '@nestjs/common';
import { ToxicityReportsService } from './services/toxicity-reports.service';
import { ToxicityReportsController } from './controllers/toxicity-reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  providers: [ToxicityReportsService],
  controllers: [ToxicityReportsController],
})
export class ToxicityReportsModule {}
