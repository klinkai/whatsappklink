import {BadRequestException, Body, Controller, Post} from '@nestjs/common';
import {MessageService} from '../service/message.service';
import {SendMessageDto} from '../dto/message/sendMessage.dto';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/message/send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto)  {
    return await this.messageService.sendMessage(sendMessageDto.phoneNumber, sendMessageDto.msg)
  }

}
