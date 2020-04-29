import {BadRequestException, Body, Controller, Get, Post} from '@nestjs/common';
import {MessageService} from '../service/message.service';
import {SendMessageDto} from '../dto/message/sendMessage.dto';
import {SendMediaMessageDto} from '../dto/message/sendMediaMessage.dto';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/message/send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto)  {
    return await this.messageService.sendMessage(sendMessageDto.phoneNumber, sendMessageDto.msg)
  }

  @Post('/message/sendMedia')
  async sendMediaMessage(@Body() sendMediaMessage: SendMediaMessageDto)  {
    return await this.messageService.sendMediaMessage(sendMediaMessage.phoneNumber, sendMediaMessage.mimeType, sendMediaMessage.base64Content, sendMediaMessage.fileName)
  }

  @Get('/message/read/all')
  async readAllMessages(@Body() sendMediaMessage: SendMediaMessageDto)  {
    return await this.messageService.readAllMessages()
  }


}
