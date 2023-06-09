import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ColorCodedMessages } from 'src/utility/colorCodedMessages/colorCodedMessages';
import { getRootPath, readFileContent } from 'src/utility/fileUtils/fileUtils';

@Injectable()
export class TelemetryService {
  telemtryPath = 'collectiveData/telemetry';
  telemetryDocPath = 'telemtry.txt';
  private existsTelemetryFolder(dir: string): boolean {
    return fs.existsSync(dir);
  }
  private createTelemetryFolder(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
  }
  private createTelemetryFolderIfNotExists(dir: string) {
    if (!this.existsTelemetryFolder(dir)) {
      this.createTelemetryFolder(dir);
    }
  }
  private existsTelemetryDoc(dir: string): boolean {
    return fs.existsSync(dir);
  }

  private createTelemetryDoc(dir: string, data: string) {
    fs.writeFileSync(dir, data);
  }
  private createTelemetryDocIfNotExists(dir: string) {
    if (!this.existsTelemetryDoc(dir)) {
      this.createTelemetryDoc(dir, '0');
    }
  }

  private incrementUserCount(dir: string) {
    const data = readFileContent(dir);
    this.createTelemetryDoc(dir, `${+data + 1}`);
  }

  updateElapsedUserCount() {
    try {
      const telemetryFolderPath = path.join(getRootPath(), this.telemtryPath);
      const telemetryDocPath = path.join(
        getRootPath(),
        this.telemtryPath,
        this.telemetryDocPath,
      );
      this.createTelemetryFolderIfNotExists(telemetryFolderPath);
      this.createTelemetryDocIfNotExists(telemetryDocPath);
      this.incrementUserCount(telemetryDocPath);
    } catch (error) {
      ColorCodedMessages.RedMessage(error);
    }
  }
}
