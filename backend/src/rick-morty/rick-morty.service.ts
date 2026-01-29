import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

type RMCharacter = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
};

type RMLocation = {
  id: number;
  name: string;
  type: string;
  dimension: string;
};

export type CharacterWithOriginLocation = {
  id: number;
  name: string;
  status: RMCharacter['status'];
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: {
    name: string;
    location: {
      name: string;
      type: string;
      dimension: string;
    } | null;
  };
};

@Injectable()
export class RickMortyService {
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private readonly http: HttpService) {}

  async getCharacterWithOriginLocation(
    id: number,
  ): Promise<CharacterWithOriginLocation> {
    try {
      const character = await this.fetchCharacter(id);

      // Si origin no tiene URL (unknown), devolvemos null en location
      const originLocation =
        character.origin?.url && character.origin.url.trim().length > 0
          ? await this.fetchLocationByUrl(character.origin.url)
          : null;

      return {
        id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
        type: character.type,
        gender: character.gender,
        image: character.image,
        origin: {
          name: character.origin?.name ?? 'unknown',
          location: originLocation
            ? {
                name: originLocation.name,
                type: originLocation.type,
                dimension: originLocation.dimension,
              }
            : null,
        },
      };
    } catch (err: any) {
      // 404 desde la API externa
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw new NotFoundException('Personaje no encontrado');
      }
      // Otras caídas: timeouts, 5xx, etc.
      throw new ServiceUnavailableException(
        'No fue posible consultar la API de Rick and Morty',
      );
    }
  }

  private async fetchCharacter(id: number): Promise<RMCharacter> {
    const url = `${this.baseUrl}/character/${id}`;
    const res$ = this.http.get<RMCharacter>(url);
    const { data } = await firstValueFrom(res$);
    return data;
  }

  private async fetchLocationByUrl(url: string): Promise<RMLocation> {
    const res$ = this.http.get<RMLocation>(url);
    const { data } = await firstValueFrom(res$);
    return data;
  }
}
