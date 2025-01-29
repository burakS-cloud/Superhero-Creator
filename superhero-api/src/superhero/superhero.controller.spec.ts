import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { SuperheroController } from './superhero.controller';
import { SuperheroService } from './superhero.service';

describe('SuperheroController', () => {
  let controller: SuperheroController;
  let service: SuperheroService;
  const dataPath = path.join(__dirname, '../../data/superheroes.json');

  beforeEach(async () => {
    // Clear the data file before each test
    if (fs.existsSync(dataPath)) {
      fs.writeFileSync(
        dataPath,
        JSON.stringify({ superheroes: [], lastId: 1 }),
      );
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroController],
      providers: [SuperheroService],
    }).compile();

    controller = module.get<SuperheroController>(SuperheroController);
    service = module.get<SuperheroService>(SuperheroService);
  });

  it('should create a superhero', async () => {
    const newHero = {
      name: 'Test Hero',
      superpower: 'Testing',
      humilityScore: 7,
    };

    const result = controller.create(newHero);

    expect(result).toEqual({
      id: expect.any(Number),
      ...newHero,
    });
  });

  it('should not create a superhero with duplicate name', async () => {
    const hero = {
      name: 'Unique Hero',
      superpower: 'Testing',
      humilityScore: 7,
    };

    // Create the first hero
    controller.create(hero);

    // Try to create another hero with the same name
    expect(() => {
      controller.create(hero);
    }).toThrow(ConflictException);
  });

  it('should return sorted superheroes by humility score', async () => {
    const heroes = [
      { name: 'Hero 1', superpower: 'Power 1', humilityScore: 5 },
      { name: 'Hero 2', superpower: 'Power 2', humilityScore: 9 },
      { name: 'Hero 3', superpower: 'Power 3', humilityScore: 3 },
    ];

    // Create multiple heroes
    heroes.forEach((hero) => controller.create(hero));

    const result = controller.findAll();

    expect(result).toHaveLength(3);
    expect(result[0].humilityScore).toBe(9); // First should be highest score
    expect(result[2].humilityScore).toBe(3); // Last should be lowest score
  });

  it('should reject humility scores outside 1-10 range', () => {
    expect(() => {
      controller.create({
        name: 'Invalid Hero',
        superpower: 'Testing',
        humilityScore: 11,
      });
    }).toThrow();
  });

  it('should delete a superhero', () => {
    const hero = {
      name: 'To Be Deleted',
      superpower: 'Testing',
      humilityScore: 5,
    };

    const created = controller.create(hero);
    controller.remove(created.id);

    const allHeroes = controller.findAll();
    expect(allHeroes).toHaveLength(0);
  });
});
