import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ToxicityReportsService } from '../services/toxicity-reports.service';

@ApiTags('toxicity-reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('toxicity-reports')
export class ToxicityReportsController {
  constructor(
    private readonly toxicityReportsService: ToxicityReportsService,
  ) {}
}
