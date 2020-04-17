import {BadRequestException, Injectable} from '@nestjs/common';
import {ClientService} from './client.service';

@Injectable()
export class MessageService {
  constructor(private readonly clientService: ClientService) {}

   async sendMessage(phoneNumber: string, msg: string) {
      await this.clientService.sendMessage(phoneNumber, msg)
   }

}