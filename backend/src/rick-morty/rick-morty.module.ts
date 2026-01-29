import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RickMortyService } from './rick-morty.service';
import { RickMortyController } from './rick-morty.controller';

@Module({
  imports: [HttpModule],
  controllers: [RickMortyController],
  providers: [RickMortyService],
})
export class RickMortyModule {}
