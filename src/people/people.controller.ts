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
import { UpdatePersonDto } from './dto/update-person.dto';
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

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @Get('new')
  send() {
    return this.rabbitmqService.send('create-people', {
      name: 'Alysson Martin',
      email: 'alysson.ti@grupointegrado.br',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peopleService.remove(+id);
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
