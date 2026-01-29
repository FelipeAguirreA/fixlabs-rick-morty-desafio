import { Test, TestingModule } from '@nestjs/testing';
import { RickMortyService } from './rick-morty.service';

describe('RickMortyService', () => {
  let service: RickMortyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RickMortyService],
    }).compile();

    service = module.get<RickMortyService>(RickMortyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
