import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryService } from './services/telemetry/telemetry.service';
import { WebsocketModule } from './Websocket/Websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [AppController],
  providers: [AppService, TelemetryService],
})
export class AppModule {}
