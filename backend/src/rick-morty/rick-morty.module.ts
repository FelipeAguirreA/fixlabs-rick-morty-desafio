import { Module } from '@nestjs/common';
import { RickMortyService } from './rick-morty.service';
import { RickMortyController } from './rick-morty.controller';

@Module({
  providers: [RickMortyService],
  controllers: [RickMortyController]
})
export class RickMortyModule {}
