import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from 'src/pokemon/interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //? Esto es igual a un select * from pokemons;
    const insertPokemons: { name: string; no: number }[] = [];
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const { results } = data;
    results.forEach(({ name, url }) => {
      const segmentUrl = url.split('/');
      const no = +segmentUrl[segmentUrl.length - 2];
      insertPokemons.push({ name, no });
    });
    const pokemones = await this.pokemonModel.insertMany(insertPokemons);
    return 'Seed executed';
  }
}
