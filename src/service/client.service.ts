import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Client} from 'whatsapp-web.js';
import {QrCodeDto} from '../dto/authentication/qrcode.dto';
import {StatusDto} from '../dto/authentication/status.dto';


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
    });

    this.whatsClient.on('ready', () => {
      this.logger.log('WhatsApp Ready');
      this.ready = true;
    });

    this.whatsClient.on('disconnected', (reason) => {
      this.logger.log(`WhatsApp Disconnected, reason: ${reason}`);
      this.ready = false;
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

}