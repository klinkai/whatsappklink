import {Controller, Get} from '@nestjs/common';
import {ClientService} from '../service/client.service';
import {QrCodeDto} from '../dto/authentication/qrcode.dto';
import {StatusDto} from '../dto/authentication/status.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly clientService: ClientService) {}

  @Get('/authentication/qrcode')
   getQRCode(): QrCodeDto {
    return this.clientService.getQRCode()
  }

  @Get('/authentication/status')
  getStatus(): StatusDto {
    return this.clientService.getStatus()
  }
}
