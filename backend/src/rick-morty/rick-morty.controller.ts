import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  RickMortyService,
  CharacterWithOriginLocation,
} from './rick-morty.service';

@Controller()
export class RickMortyController {
  constructor(private readonly rm: RickMortyService) {}

  @Get('character/:id')
  getCharacter(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CharacterWithOriginLocation> {
    return this.rm.getCharacterWithOriginLocation(id);
  }
}
