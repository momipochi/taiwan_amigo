import { baseFetchWithData } from "../shared/api/baseFetchApi/baseFetchApi";
import { API_ROUTES } from "../shared/constants/links/links";

interface UpdateTelemetryDto {
    connectionWaitTime: Number;
  }

export class Timer {
  private startTime: number;
  private elapsedTime: number;
  constructor() {
    this.startTime = 0;
    this.elapsedTime = 0;
  }
  start() {
    this.startTime = Date.now();
  }

  stop() {
    this.elapsedTime = Date.now() - this.startTime;
    this.sendTotalWaitTime();
  }
  private async sendTotalWaitTime() {
    const data:UpdateTelemetryDto = {
      connectionWaitTime: this.elapsedTime,
    };
    console.log('heelo yes im called')
    await baseFetchWithData(API_ROUTES.TOTAL_WAIT_TIME, "PUT",data);
  }
}
