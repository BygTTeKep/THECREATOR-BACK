import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import {
  SdekMapsWidgetService,
  WIDGET_VERSION,
} from '../../infrastructure/services/sdek/sdekMapsWidget.service';

@ApiExcludeController()
@Controller('delivery/maps')
export class SdekMapsController {
  constructor(private readonly sdekMapsWidgetService: SdekMapsWidgetService) {}

  @Get('service.php')
  async getService(
    @Query() query: Record<string, unknown>,
    @Res() res: Response,
  ) {
    return this.handle(query, {}, res);
  }

  @Post('service.php')
  async postService(
    @Query() query: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    return this.handle(query, body ?? {}, res);
  }

  private async handle(
    query: Record<string, unknown>,
    body: Record<string, unknown>,
    res: Response,
  ) {
    try {
      const requestData = { ...query, ...body };
      const data = await this.sdekMapsWidgetService.process(requestData);

      res.status(data.httpCode);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Service-Version', WIDGET_VERSION);
      for (const [key, value] of Object.entries(data.addedHeaders)) {
        res.setHeader(key, value);
      }
      return res.send(data.result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        const payload = error.getResponse();
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Service-Version', WIDGET_VERSION);
        return res.send(
          typeof payload === 'string' ? { message: payload } : payload,
        );
      }
      throw error;
    }
  }
}