import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from '../schemas/report.schema';
import { Model, Types } from 'mongoose';
import {
  CreateToxicityReportDto,
  DecideToxicityReportDto,
} from '../dtos/toxicityReport.dto';
import { ReportType } from '../models/report-type.model';
import { Post } from 'src/posts/schemas/post.schema';
import { Comment } from 'src/posts/schemas/comment.schema';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';
import { ReportStatus } from '../models/report-status.model';

@Injectable()
export class ToxicityReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(data: CreateToxicityReportDto) {
    let userId: Types.ObjectId;
    let content: string;

    const report = await this.reportModel.findOne({
      reportedElementId: data.reportedElementId,
    });

    if (report) {
      throw new ConflictException('Report already exists');
    }

    if (data.type === ReportType.COMMENT) {
      const comment = await this.commentModel.findOne({
        _id: data.reportedElementId,
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      userId = comment.user;
      content = comment.content;
    }

    if (data.type === ReportType.POST) {
      const post = await this.postModel.findOne({
        _id: data.reportedElementId,
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      userId = post.user;
      content = post.description;
    }

    const newReport = new this.reportModel({
      ...data,
      content,
      user: userId,
    });

    return await newReport.save();
  }

  async findAll(paginationParams: PaginationParamsDto) {
    const { limit = 20, page = 1 } = paginationParams;

    const skip = limit * (page - 1);
    const count = await this.reportModel.count();
    const pages = Math.ceil(count / limit);

    const reports = await this.reportModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .populate('user', 'username name lastname picture'); // select username, name, lastname and picture field

    return {
      reports,
      pagination: {
        count,
        page,
        pages,
        limit,
      },
    };
  }

  async findPending(paginationParams: PaginationParamsDto) {
    const { limit = 20, page = 1 } = paginationParams;

    const skip = limit * (page - 1);
    const count = await this.reportModel.count({
      status: ReportStatus.PENDING,
    });
    const pages = Math.ceil(count / limit);

    const reports = await this.reportModel
      .find({ status: ReportStatus.PENDING })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .populate('user', 'username name lastname picture'); // select username, name, lastname and picture field

    return {
      reports,
      pagination: {
        count,
        page,
        pages,
        limit,
      },
    };
  }

  async findOneById(id: Types.ObjectId) {
    const report = await this.reportModel
      .findOne({ _id: id })
      .populate('user', 'username name lastname picture'); // select username, name, lastname and picture field

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async decide(
    reportId: Types.ObjectId,
    userId: Types.ObjectId,
    data: DecideToxicityReportDto,
  ) {
    const report = await this.reportModel.findOne({ _id: reportId });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== ReportStatus.PENDING) {
      throw new ConflictException('Report already decided');
    }

    return await this.reportModel.findByIdAndUpdate(
      reportId,
      {
        $set: {
          status: data.status,
          reviewer: userId,
          revisionDate: new Date(),
        },
      },
      { new: true },
    );
  }
}
