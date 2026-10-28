import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    const { name } = createPokemonDto;
    createPokemonDto.name = name.toLocaleLowerCase().trim();
    /**
     * ? Cuando se intenta crear un pokemon con name o id repetido da un error
     * ? vamos a tratar de evitar consultar primero a la BD a ver si existe y despues insertar, sino que vamos a controlar el error por el codigo de error que nos devuelve mongo
     */
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon existe in db: ${JSON.stringify(error.keyValue)}`,
        );
      }

      throw new InternalServerErrorException(
        `Can't creat Pokemon - Check the server logs`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  /**
   * ?permite realizar la busqueda por mongoid, nombre o numero(no)
   * @param term
   * @returns
   */
  async findOne(term: string) {
    let pokemon: Pokemon | null = null;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    console.info('Pokemon encontrado en actualizacion');
    const pokemon = await this.findOne(term);
    console.log('Pokemon actualizado');
    console.table(pokemon.toJSON());

    const { name } = updatePokemonDto;
    if (name) updatePokemonDto.name = name.toLocaleLowerCase().trim();
    try {
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto);
      console.log('Pokemon actualizado');
      console.table(updatedPokemon);
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon existe in db: ${JSON.stringify(error.keyValue)}`,
        );
      }

      throw new InternalServerErrorException(
        `Can't creat Pokemon - Check the server logs`,
      );
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //const pokemon = this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
  }
}
