import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import * as ColorCodedMessages from 'src/utility/colorCodedMessages/colorCodedMessages';

// describe('TelemetryService', () => {
//   let service: TelemetryService;
//   jest.mock('src/utility/colorCodedMessages/colorCodedMessages', jest.fn());
//   const spy = jest.spyOn(ColorCodedMessages.ColorCodedMessages, 'RedMessage');
//   spy.mockImplementation(jest.fn());
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [TelemetryService],
//     }).compile();

//     service = module.get<TelemetryService>(TelemetryService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
