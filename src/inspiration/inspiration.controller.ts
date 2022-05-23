import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/inspirations')
export class InspirationController {
  constructor(private inspirationService: null) {}

  @Get()
  @HttpCode(200)
  async getInspirations() {
    const getInspirations = await this.projectService.getInspirations();
    return getInspirations;
  }
}
