import { Test, TestingModule } from '@nestjs/testing';
import { RickMortyController } from './rick-morty.controller';

describe('RickMortyController', () => {
  let controller: RickMortyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RickMortyController],
    }).compile();

    controller = module.get<RickMortyController>(RickMortyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
