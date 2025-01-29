import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero-dto';
import { Superhero } from './entities/superhero.entity';
import { SuperheroService } from './superhero.service';

@Controller('superheroes')
export class SuperheroController {
  constructor(private readonly superheroService: SuperheroService) {}

  @Post()
  create(@Body() createSuperheroDto: CreateSuperheroDto): Superhero {
    return this.superheroService.create(createSuperheroDto);
  }

  @Get()
  findAll(): Superhero[] {
    return this.superheroService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.superheroService.remove(+id);
  }
}
