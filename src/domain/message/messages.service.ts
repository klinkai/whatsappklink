import {Injectable, Logger} from '@nestjs/common';
import {Message} from './message.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';


@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>
  ) {}

  private readonly logger = new Logger(MessagesService.name);

  findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  findOne(id: string): Promise<Message> {
    return this.messagesRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.messagesRepository.delete(id);
  }

  async save(message: Message) {
    await this.messagesRepository.save(message)
  }

}