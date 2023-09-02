import { Body, Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { TelemetryService } from './services/telemetry/telemetry.service';
import { UpdateTelemetryDto } from './models/dto/updateTelemetryDto';

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
  @Put('totalWaitTime')
  updateTotalConnectionTime(@Body() data:UpdateTelemetryDto) {
    console.log(data)
    if(!data){
      return "No data found"
    }
    this.telemetryService.updateTotalConnectionWaitTime(data.connectionWaitTime);
  }

  @Get('205e60d1666ac2d537787b94eea36aa70e89e29fc476d946e3a0243384f1cf0e')
  getTelemetry(){
    return this.telemetryService.getTelemetry();
  }
}
