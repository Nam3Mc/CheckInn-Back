import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create_preference')
  async createPreference(@Body() body: any, @Res() res: Response) {
    try {
      const response = await this.appService.createPreference(body);
      res.json({ id: response.id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear la preferencia');
    }
  }
}
