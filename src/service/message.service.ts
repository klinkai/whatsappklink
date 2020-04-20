import {Injectable, Logger} from '@nestjs/common';
import {ClientService} from './client.service';


@Injectable()
export class MessageService {
  constructor(private readonly clientService: ClientService) {}

  private readonly logger = new Logger(MessageService.name);



  async sendMessage(phoneNumber: string, msg: string) {
      await this.clientService.sendMessage(phoneNumber, msg)
   }

}