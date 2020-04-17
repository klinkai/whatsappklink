import {Module} from '@nestjs/common';
import {AppController} from './controller/app.controller';
import {AuthenticationController} from './controller/authentication.controller';
import {ClientService} from './service/client.service';
import {AppService} from './service/app.service';
import {MessageController} from './controller/message.controller';
import {MessageService} from './service/message.service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticationController, MessageController],
  providers: [AppService, ClientService, MessageService],
})
export class AppModule {
}
