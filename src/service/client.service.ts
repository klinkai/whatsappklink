import {BadRequestException, HttpException, HttpStatus, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Client} from 'whatsapp-web.js';
import {QrCodeDto} from '../dto/authentication/qrcode.dto';
import {StatusDto} from '../dto/authentication/status.dto';

const QrCodeTerminal = require('qrcode-terminal');
// No NestJS 7 não tem o Scope.SINGLETON para passar na anotação Injectable
// mas o comportamento default é o SINGLETON
@Injectable()
export class ClientService implements OnModuleInit {

  private whatsClient: Client = new Client();

  private qrCode: string;

  private ready = false;

  private readonly logger = new Logger(ClientService.name);

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
    });

    this.whatsClient.on('disconnected', (reason) => {
      this.logger.log(`WhatsApp Disconnected, reason: ${reason}`);
      this.ready = false;
    });

    this.whatsClient.on('message', message => {
      this.logger.log(message);
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
  }
}