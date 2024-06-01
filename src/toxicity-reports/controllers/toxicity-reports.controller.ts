import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ToxicityReportsService } from '../services/toxicity-reports.service';
import { CreateToxicityReportDto } from '../dtos/toxicityReport.dto';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';

@ApiTags('toxicity-reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('toxicity-reports')
export class ToxicityReportsController {
  constructor(
    private readonly toxicityReportsService: ToxicityReportsService,
  ) {}

  /**
   * Create a new toxicity report
   */
  @ApiCreatedResponse({ description: 'Report created' })
  @ApiNotFoundResponse({ description: 'Element not found' })
  @ApiConflictResponse({ description: 'Report already exists' })
  @ApiUnauthorizedResponse({ description: "User aren't authenticated" })
  @Post()
  async create(@Body() body: CreateToxicityReportDto) {
    return {
      data: await this.toxicityReportsService.create(body),
    };
  }

  /**
   * Find all toxicity reports
   */
  @ApiOkResponse({ description: 'Toxicity reports found' })
  @ApiUnauthorizedResponse({ description: "User aren't authenticated" })
  @Get()
  async getHistory(@Query() query: PaginationParamsDto) {
    return {
      data: await this.toxicityReportsService.findAll(query),
    };
  }
}
