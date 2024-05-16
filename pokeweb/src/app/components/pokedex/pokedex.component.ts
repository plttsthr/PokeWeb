import { Component, OnInit } from '@angular/core';
import { AddPokemonsPokedexService } from '../../services/add-pokemons-pokedex.service';
import { PokemonInfo, Pokemon } from '../../interfaces/pokemonModel';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { SearchService } from '../../services/search-bar.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  addedPokemons: PokemonInfo[] = [];
  pokemonWithSprites: (PokemonInfo & { spriteUrl?: string })[] = [];
  selectedPokemon: PokemonInfo | undefined;
  selectedPokemonDetails: { height: number; weight: number; types: string[] } = { height: 0, weight: 0, types: [] };
  selectedPokemonDescription: string = '';

  constructor(
    private pokedexService: AddPokemonsPokedexService,
    private pokemonService: PokemonAPIService,
    private searchService: SearchService)
  {}

  ngOnInit(): void {
    this.loadAddedPokemons();
    
  }

  loadAddedPokemons(): void {
    this.pokedexService.addedPokemons$.subscribe((pokemons: PokemonInfo[]) => {
      this.addedPokemons = pokemons;
      this.loadSpritesForPokemons();
    });
  }

  async loadSpritesForPokemons(): Promise<void> {
    this.pokemonWithSprites = []; // Clear existing data

    // Fill the array with dummy data to display 5 cards if there are fewer than 5 Pokémon
    for (let i = 0; i < Math.max(7, this.addedPokemons.length); i++) {
      const pokemon = this.addedPokemons[i];
      const spriteUrl = pokemon ? (await this.getSpriteUrl(pokemon)) : undefined;
      this.pokemonWithSprites.push({ ...pokemon, spriteUrl });
    }
  }

  async getSpriteUrl(pokemon: PokemonInfo): Promise<string | undefined> {
    try {
      const fullPokemonData: Pokemon = await this.pokemonService.getById(pokemon.id);
      return fullPokemonData.sprites?.front_default;
    } catch (error) {
      console.error(`Error fetching sprites for Pokémon with ID ${pokemon.id}:`, error);
      return undefined;
    }
  }

  selectPokemon(pokemon: PokemonInfo): void {
    this.selectedPokemon = pokemon;
    this.loadPokemonDetails(pokemon);
    this.loadPokemonDescription(pokemon);
  }

  async loadPokemonDetails(pokemon: PokemonInfo): Promise<void> {
    try {
      this.selectedPokemonDetails = await this.getDetails(pokemon);
    } catch (error) {
      console.error(`Error fetching details for Pokémon with ID ${pokemon.id}:`, error);
    }
  }

  async loadPokemonDescription(pokemon: PokemonInfo): Promise<void> {
    try {
      this.selectedPokemonDescription = await this.pokemonService.getPokemonDescription(pokemon.id);
    } catch (error) {
      console.error(`Error fetching description for Pokémon with ID ${pokemon.id}:`, error);
    }
  }

  async getDetails(pokemon: PokemonInfo): Promise<{ height: number; weight: number; types: string[] }> {
    try {
      const fullPokemonData: Pokemon = await this.pokemonService.getById(pokemon.id);
      const height = fullPokemonData.height;
      const weight = fullPokemonData.weight;
      const types = fullPokemonData.types.map((type: any) => type.type.name);
      return { height, weight, types };
    } catch (error) {
      console.error(`Error fetching details for Pokémon with ID ${pokemon.id}:`, error);
      return { height: 0, weight: 0, types: [] }; // Return default values on error
    }
  }
}
