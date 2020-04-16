import {Module} from '@nestjs/common';
import {AppController} from './controller/app.controller';
import {AuthenticationController} from './controller/authentication.controller';
import {ClientService} from './service/client.service';
import {AppService} from './service/app.service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, ClientService],
})
export class AppModule {
}
