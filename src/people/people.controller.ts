import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitmqService } from 'src/common/rabbitmq/rabbitmq.service';

@Controller('people')
export class PeopleController {
  private readonly logger = new Logger(PeopleController.name);
  constructor(
    private readonly peopleService: PeopleService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Get('send')
  send() {
    const people = {
      name: 'Alysson Martin',
      email: 'alysson.ti@grupointegrado.br',
    };
    this.rabbitmqService.send('create-people', people);
    return this.peopleService.create(people);
  }

  @MessagePattern('create-people')
  public async OpportunityCreateInscricaoTeste(
    @Payload() data: CreatePersonDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`AMPQ create-people`);
      await this.peopleService.create(data);
      // throw new Error(`Erro aqui`);
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(error.message);
      // channel.nack(originalMsg);
    }
  }
}
