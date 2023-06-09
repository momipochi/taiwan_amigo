import { Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { TelemetryService } from './services/telemetry/telemetry.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telemetryService: TelemetryService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Put('Wassup')
  updateTelemetry() {
    this.telemetryService.updateElapsedUserCount();
  }
}
