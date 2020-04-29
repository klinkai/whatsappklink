import {BadRequestException, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Client, MessageMedia} from 'whatsapp-web.js';
import {QrCodeDto} from '../dto/authentication/qrcode.dto';
import {StatusDto} from '../dto/authentication/status.dto';
import {Message} from '../domain/message/message.entity';
import {MessagesService} from '../domain/message/messages.service';
import ShortUniqueId from 'short-unique-id';


const QrCodeTerminal = require('qrcode-terminal');
// No NestJS 7 não tem o Scope.SINGLETON para passar na anotação Injectable
// mas o comportamento default é o SINGLETON
@Injectable()
export class ClientService implements OnModuleInit {
  constructor(private readonly messagesService: MessagesService) {}

  private whatsClient: Client = new Client();

  private qrCode: string;

  private ready = false;

  private readonly logger = new Logger(ClientService.name);

  private readonly uid = new ShortUniqueId();


  onModuleInit() {

    this.logger.log('Starting WhatsAppClient');

    this.whatsClient.initialize();

    this.whatsClient.on('qr', (qr) => {
      this.logger.log(`Rececived QrCode ${qr}`);
      this.qrCode = qr;
      QrCodeTerminal.generate(qr, {small: true});
    });

    this.whatsClient.on('ready', () => {
      this.logger.log('WhatsApp Ready');
      this.ready = true;
      this.logger.log(this.whatsClient.info);
    });

    this.whatsClient.on('disconnected', (reason) => {
      this.logger.log(`WhatsApp Disconnected, reason: ${reason}`);
      this.ready = false;
      this.whatsClient.initialize();
    });

    this.whatsClient.on('message', msg => {

      if(msg.hasMedia) {
        const attachmentData = msg.downloadMedia();
        attachmentData.then((data) => {
          this.logger.log('Mensagem de Media Resolvida')
          this.logger.log('Creating Message in Database');
          const message = new Message();
          message.id = msg.id._serialized;
          message.fromMe = msg.id.fromMe;
          message.idMessage = msg.id.id;
          message.ack = msg.ack;
          message.hasMedia = msg.hasMedia;
          message.body = data.data;
          message.msgType = data.mimetype;
          message.timestamp = msg.timestamp;
          message.from = msg.from;
          message.to = msg.from;
          message.isForwarded = msg.isForwarded;
          message.broadcast = msg.broadcast;
          message.hasQuotedMsg = msg.hasQuotedMsg;
          message.mentionedIds = msg.mentionedIds.join(",");
          message.mediaObjectName = "";
          this.messagesService.save(message);
          this.logger.log('Message Saved');
        })
      } else {

        this.logger.log('Creating Message in Database');
        const message = new Message();
        message.id = msg.id._serialized;
        message.fromMe = msg.id.fromMe;
        message.idMessage = msg.id.id;
        message.ack = msg.ack;
        message.hasMedia = msg.hasMedia;
        message.body = msg.body;
        message.msgType = msg.type;
        message.timestamp = msg.timestamp;
        message.from = msg.from;
        message.to = msg.from;
        message.isForwarded = msg.isForwarded;
        message.broadcast = msg.broadcast;
        message.hasQuotedMsg = msg.hasQuotedMsg;
        message.mentionedIds = msg.mentionedIds.join(",");
        message.mediaObjectName = "";
        this.messagesService.save(message);
        this.logger.log('Message Saved');
      }
    });

  }

  getQRCode(): QrCodeDto {
    const response = new QrCodeDto();
    response.qrCode = this.qrCode;
    return response;
  }

  getStatus(): StatusDto {
    const response = new StatusDto();
    response.ready = this.ready;
    return response;
  }

  async sendMessage(phoneNumber: string, msg: string) {
    if (!this.ready) {
      throw new BadRequestException('WhatsApp Client is not ready!');
    }
     const messageProcessing =  {
          processed: false,
          message: null
     };

    await this.whatsClient.sendMessage(`${phoneNumber}@c.us`, msg).then(() => {
       messageProcessing.processed = true;
      }).catch(error => {
       messageProcessing.message = error.message;
       messageProcessing.processed = true;
     });

     if(messageProcessing.message != null) {
       throw new BadRequestException(messageProcessing.message)
     }

    this.logger.log('Creating Message in Database');
    const message = new Message();
    const uuid = this.uid.randomUUID(20);
    message.id = `true_${phoneNumber}@c.us_${uuid}`;
    message.fromMe = true;
    message.idMessage = uuid;
    message.ack = -1;
    message.hasMedia = false;
    message.body = msg;
    message.msgType = 'chat';
    message.timestamp = (Date.now() / 1000 | 0).toString();
    message.from = `${this.whatsClient.info.me.user}`;
    message.to = `${phoneNumber}@c.us`;
    message.isForwarded = false;
    message.broadcast = false;
    message.hasQuotedMsg = 'false';
    message.mentionedIds = '';
    message.mediaObjectName = "";
    this.messagesService.save(message);
    this.logger.log('Message Saved');
  }

  async sendMediaMessage(phoneNumber: string, mimeType: string, base64Content: string, fileName: string) {
    if (!this.ready) {
      throw new BadRequestException('WhatsApp Client is not ready!');
    }
    const messageProcessing =  {
      processed: false,
      message: null
    };

    const messageMedia = new MessageMedia(mimeType, base64Content)

    await this.whatsClient.sendMessage(`${phoneNumber}@c.us`, messageMedia).then(() => {
      messageProcessing.processed = true;
    }).catch(error => {
      messageProcessing.message = error.message;
      messageProcessing.processed = true;
    });

    if(messageProcessing.message != null) {
      throw new BadRequestException(messageProcessing.message)
    }

    this.logger.log('Creating Message Media in Database');
    const message = new Message();
    const uuid = this.uid.randomUUID(20);
    message.id = `true_${phoneNumber}@c.us_${uuid}`;
    message.fromMe = true;
    message.idMessage = uuid;
    message.ack = -1;
    message.hasMedia = true;
    message.body = base64Content;
    message.msgType = mimeType;
    message.timestamp = (Date.now() / 1000 | 0).toString();
    message.from = `${this.whatsClient.info.me.user}`;
    message.to = `${phoneNumber}@c.us`;
    message.isForwarded = false;
    message.broadcast = false;
    message.hasQuotedMsg = 'false';
    message.mentionedIds = '';
    message.mediaObjectName = "";
    this.messagesService.save(message);
    this.logger.log('Message Saved');
  }
}