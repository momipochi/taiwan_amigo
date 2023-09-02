import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ColorCodedMessages } from 'src/utility/colorCodedMessages/colorCodedMessages';
import { getRootPath, readFileContent } from 'src/utility/fileUtils/fileUtils';

@Injectable()
export class TelemetryService {
  private TOTAL_ACCESS_COUNT = 'totalAccessCount';
  private TOTAL_CONNECTION_WAIT_TIME = 'totalConnectionWaitTime';
  private TOTAL_CONNECTION_WAIT_COUNTER = 'totalConnectionWaitCounter';
  private telemtryPath = 'collectiveData/telemetry';
  private telemetryDocPath = 'telemtry.json';
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
  private newDateEntry() {
    return `\"${this.getToday()}\":{\"${this.TOTAL_ACCESS_COUNT}\":0,\"${
      this.TOTAL_CONNECTION_WAIT_TIME
    }\":0,\"${this.TOTAL_CONNECTION_WAIT_COUNTER}\":0}`;
  }
  private getToday() {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
  private createTelemetryDocIfNotExists(dir: string) {
    const data = this.newDateEntry();
    if (!this.existsTelemetryDoc(dir)) {
      this.createTelemetryDoc(
        dir,
        `{
          ${data}
      }`,
      );
    }
  }

  private incrementUserCount(dir: string) {
    try {
      const data = JSON.parse(readFileContent(dir));
      data[this.getToday()][this.TOTAL_ACCESS_COUNT]++;
      this.createTelemetryDoc(dir, JSON.stringify(data));
    } catch (error) {
      ColorCodedMessages.RedMessage(error);
    }
  }
  private incrementTotalConnectionWaitTime(dir: string, additionalTime: number) {
    try {
      const data = JSON.parse(readFileContent(dir));
      data[this.getToday()][this.TOTAL_CONNECTION_WAIT_COUNTER]++;
      data[this.getToday()][this.TOTAL_CONNECTION_WAIT_TIME] += additionalTime;
      this.createTelemetryDoc(dir, JSON.stringify(data));
    } catch (error) {
      ColorCodedMessages.RedMessage(error);
    }
  }
  private getTelemetryFolderPath(){
    return path.join(getRootPath(), this.telemtryPath);
  }
  private getTelemetryDocPath(){
    return path.join(
      getRootPath(),
      this.telemtryPath,
      this.telemetryDocPath,
    );
  }
  updateElapsedUserCount() {
    try {
      const telemetryFolderPath = this.getTelemetryFolderPath()
      const telemetryDocPath = this.getTelemetryDocPath();
      this.createTelemetryFolderIfNotExists(telemetryFolderPath);
      this.createTelemetryDocIfNotExists(telemetryDocPath);
      this.incrementUserCount(telemetryDocPath);
    } catch (error) {
      ColorCodedMessages.RedMessage(error);
    }
  }
  updateTotalConnectionWaitTime(additionalTime:number) {
    try {
      const telemetryFolderPath = this.getTelemetryFolderPath()
      const telemetryDocPath = this.getTelemetryDocPath();
      this.createTelemetryFolderIfNotExists(telemetryFolderPath);
      this.createTelemetryDocIfNotExists(telemetryDocPath);
      this.incrementTotalConnectionWaitTime(telemetryDocPath,additionalTime);
    } catch (error) {
      ColorCodedMessages.RedMessage(error);
    }
  }
  getTelemetry(){
    try {
      const telemetryDocPath = this.getTelemetryDocPath();
      const data = JSON.parse(readFileContent(telemetryDocPath));
      return data
    } catch (error) {
      ColorCodedMessages.RedMessage(error);
    }
  }
}
