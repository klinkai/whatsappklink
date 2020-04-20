import {Module} from '@nestjs/common';
import {AppController} from './controller/app.controller';
import {AuthenticationController} from './controller/authentication.controller';
import {ClientService} from './service/client.service';
import {AppService} from './service/app.service';
import {MessageController} from './controller/message.controller';
import {MessageService} from './service/message.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {Message} from './domain/message/message.entity';
import {MessagesModule} from './domain/message/messages.module';



@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'silo.klink.ai',
    port: 5432,
    username: 'postgres',
    password: 'klk8123NjH',
    database: 'whatsklink',
    entities: [Message],
    synchronize: true
  }), MessagesModule],
  controllers: [AppController, AuthenticationController, MessageController],
  providers: [AppService, ClientService, MessageService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
