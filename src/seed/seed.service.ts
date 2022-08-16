import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {


  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}


  async excecuteSeed() {
    const data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650");
    const pokemons = []
    await this.pokemonModel.deleteMany({});

    data.results.forEach( ({name, url}) => {
      const segments = url.split("/");
      const no = +segments[segments.length - 2];

      pokemons.push({name, no});
    })
    // await this.pokemonService.fillPokemonsWithSeedData(pokemons)
    await this.pokemonModel.insertMany(pokemons);

    return "Seed excecuted";
  }
}
