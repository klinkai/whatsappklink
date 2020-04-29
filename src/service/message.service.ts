import {Injectable, Logger} from '@nestjs/common';
import {ClientService} from './client.service';
import {MessagesService} from '../domain/message/messages.service';


@Injectable()
export class MessageService {
  constructor(private readonly clientService: ClientService,
              private readonly messagesService: MessagesService) {}

  private readonly logger = new Logger(MessageService.name);



  async sendMessage(phoneNumber: string, msg: string) {
      await this.clientService.sendMessage(phoneNumber, msg)
  }

  async sendMediaMessage(phoneNumber: string, mimeType: string, base64Content: string, fileName: string) {
    await this.clientService.sendMediaMessage(phoneNumber, mimeType, base64Content, fileName)
  }

  async readAllMessages() {
    return this.messagesService.findAll();
  }
}