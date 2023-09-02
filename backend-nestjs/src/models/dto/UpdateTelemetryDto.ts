import { ApiProperty } from '@nestjs/swagger';

export class UpdateTelemetryDto {
  @ApiProperty({ type: Number })
  connectionWaitTime: number;
}
