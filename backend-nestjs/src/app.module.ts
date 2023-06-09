import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryService } from './services/telemetry/telemetry.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TelemetryService],
})
export class AppModule {}
