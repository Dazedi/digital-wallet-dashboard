import {
  Controller,
  Res,
  Get,
  Put,
  Body,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ExchangeEntity, ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get()
  async getExchanges() {
    return this.exchangeService.getAll();
  }

  @Get(':id')
  async getExchange(@Param('id') id: string) {
    return this.exchangeService.get(id);
  }

  @Post()
  async createExchange(@Body() exchange: CreateExchangeDto) {
    this.exchangeService.create(exchange);
  }

  @Put(':id')
  async updateExchange(
    @Param('id') id: string,
    @Body() exchange: UpdateExchangeDto,
  ) {
    const existingExchange = this.exchangeService.get(id);

    this.exchangeService.update({
      ...existingExchange,
      rate: exchange.rate,
    });
  }

  @Delete(':id')
  async deleteExchange(@Param('id') id: string) {
    this.exchangeService.delete(id);
  }
}
