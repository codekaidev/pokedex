import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from 'src/pokemon/interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=2',
    );
    const { results } = data;
    results.forEach(({ name, url }) => {
      const segmentUrl = url.split('/');
      const no = +segmentUrl[segmentUrl.length - 2];
      console.log({ name, no });
    });
    return data.results;
  }
}
