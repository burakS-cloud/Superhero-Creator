import {
  BadRequestException,
  ConflictException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateSuperheroDto } from './dto/create-superhero-dto';
import { Superhero } from './entities/superhero.entity';

@Injectable()
export class SuperheroService implements OnModuleInit {
  private superheroes: Superhero[] = [];
  private idCounter = 1;
  private readonly dataPath = path.join(
    __dirname,
    '../../data/superheroes.json',
  );

  async onModuleInit() {
    await this.loadData();
  }

  private loadData(): void {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Initialize with empty data if file doesn't exist
      if (!fs.existsSync(this.dataPath)) {
        this.superheroes = [];
        this.idCounter = 1;
        this.saveData();
        return;
      }

      // Read and parse the data file
      const data = fs.readFileSync(this.dataPath, 'utf8');
      const parsedData = JSON.parse(data);

      // Validate the data structure
      if (!parsedData || !Array.isArray(parsedData.superheroes)) {
        this.superheroes = [];
        this.idCounter = 1;
        this.saveData();
        return;
      }

      this.superheroes = parsedData.superheroes;
      this.idCounter = parsedData.lastId || 1;

      // If lastId is less than the highest id in superheroes, fix it
      const maxId = Math.max(...this.superheroes.map((hero) => hero.id), 0);
      this.idCounter = Math.max(maxId + 1, this.idCounter);

      // Save the validated data back to file
      this.saveData();
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty data if there's an error
      this.superheroes = [];
      this.idCounter = 1;
      this.saveData();
    }
  }

  private saveData(): void {
    try {
      const data = JSON.stringify(
        {
          superheroes: this.superheroes,
          lastId: this.idCounter,
        },
        null,
        2,
      ); // Added pretty printing
      fs.writeFileSync(this.dataPath, data, 'utf8');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  remove(id: number): Superhero {
    const index = this.superheroes.findIndex((hero) => hero.id === id);
    if (index === -1) {
      throw new NotFoundException(`Superhero with ID ${id} not found`);
    }
    const [removedHero] = this.superheroes.splice(index, 1);
    return removedHero;
  }

  create(createSuperheroDto: CreateSuperheroDto): Superhero {
    // Validate humility score
    const humilityScore = Number(createSuperheroDto.humilityScore);
    if (isNaN(humilityScore) || humilityScore < 1 || humilityScore > 10) {
      throw new BadRequestException(
        'Humility score must be a number between 1 and 10',
      );
    }

    // Check for duplicate name
    const existingHero = this.superheroes.find(
      (hero) =>
        hero.name.toLowerCase() === createSuperheroDto.name.toLowerCase(),
    );

    if (existingHero) {
      throw new ConflictException(
        `Superhero with name "${createSuperheroDto.name}" already exists`,
      );
    }

    const superhero: Superhero = {
      id: this.idCounter++,
      ...createSuperheroDto,
      humilityScore, // Use the validated number
    };
    this.superheroes.push(superhero);
    this.saveData();
    return superhero;
  }
  // ... rest of the service methods remain the same ...
}
