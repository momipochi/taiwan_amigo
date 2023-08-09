import { Module } from '@nestjs/common';
import { MyWebsocket } from './Websocket';

@Module({
  providers: [MyWebsocket],
})
export class WebsocketModule {}
