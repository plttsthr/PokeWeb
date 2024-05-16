import { Component, OnInit } from '@angular/core';
import { AddPokemonsPokedexService } from '../../services/add-pokemons-pokedex.service';
import { PokemonInfo, Pokemon } from '../../interfaces/pokemonModel';
import { PokemonAPIService } from '../../services/pokemon-api.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  addedPokemons: PokemonInfo[] = [];
  pokemonWithSprites: (PokemonInfo & { spriteUrl: string })[] = [];

  constructor(
    private pokedexService: AddPokemonsPokedexService,
    private pokemonService: PokemonAPIService
  ) {}

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
    for (const pokemon of this.addedPokemons) {
      try {
        const fullPokemonData: Pokemon = await this.pokemonService.getById(pokemon.id);
        const spriteUrl: string = fullPokemonData.sprites.front_default;
        this.pokemonWithSprites.push({ ...pokemon, spriteUrl });
      } catch (error) {
        console.error(`Error fetching sprites for Pokemon with ID ${pokemon.id}:`, error);
      }
    }
  }
}
