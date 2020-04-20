import {TypeOrmModule} from '@nestjs/typeorm';
import {Message} from './message.entity';
import {Module} from '@nestjs/common';
import {MessagesService} from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  exports: [MessagesService],
  providers: [MessagesService]
})
export class MessagesModule {}