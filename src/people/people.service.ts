import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PeopleService {
  create(createPersonDto: CreatePersonDto) {
    return 'This action adds a new person';
  }
}
