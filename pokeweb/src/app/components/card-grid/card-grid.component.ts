import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { resultArray } from '../../interfaces/pokemonAPI';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { Pokemon, PokemonInfo } from '../../interfaces/pokemonModel';
import { AddPokemonsPokedexService } from '../../services/add-pokemons-pokedex.service';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.css']
})
export class CardGridComponent implements OnChanges {

  constructor(private pokemonService: PokemonAPIService, private pokedexService: AddPokemonsPokedexService) { }

  ngOnChanges(): void {
    this.extractPokemonData();
  }

  @Input() pokemonData?: resultArray;
  fullPokemonData: Pokemon | undefined;
  pokemonId: string = "0";
  pokemonSprites: string[] = [];

  async extractPokemonData() {
    if (this.pokemonData) {
      this.pokemonId = this.pokemonData.url.substring(34, this.pokemonData.url.length - 1);
      try {
        // Fetch full Pokemon data by ID
        this.fullPokemonData = await this.pokemonService.getById(this.pokemonId);
        // Extract sprites from the full Pokemon data
        if (this.fullPokemonData && this.fullPokemonData.sprites) {
          this.pokemonSprites.push(this.fullPokemonData.sprites.front_default);
          // Add other sprite URLs as needed
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    }
  }

  addToPokedex(id: string, name: string): void {
    const pokemonInfo: PokemonInfo = { id, name };
    this.pokedexService.addToPokedex(pokemonInfo);
}
}
