import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { resultArray } from '../../interfaces/pokemonAPI';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { Pokemon } from '../../interfaces/pokemonModel';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.css']
})
export class CardGridComponent implements OnChanges {

  constructor(private pokemonService: PokemonAPIService) { }

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
}
