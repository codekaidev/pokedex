import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from 'src/pokemon/interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class SeedService {
  constructor(private readonly pokemonService: PokemonService) {}

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=30',
    );
    const { results } = data;
    results.forEach(({ name, url }) => {
      const segmentUrl = url.split('/');
      const no = +segmentUrl[segmentUrl.length - 2];
      this.pokemonService.create({ name, no });
    });
    return data.results;
  }
}
