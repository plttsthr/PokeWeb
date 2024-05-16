import { Component, OnInit } from '@angular/core';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { resultArray } from '../../interfaces/pokemonAPI';
import { SearchService } from '../../services/search-bar.service';

@Component({
  selector: 'app-grid-visualizer',
  templateUrl: './grid-visualizer.component.html',
  styleUrls: ['./grid-visualizer.component.css']
})
export class GridVisualizerComponent implements OnInit{

  constructor(private pokemonservice: PokemonAPIService, 
              private searchService: SearchService) {} // Inject the Pokédex service

  pokemonList: resultArray[] = [];
  loading: boolean = false;
  filteredPokemonList: resultArray[] = [];

  ngOnInit(): void {
    this.loadFullList();
    this.searchService.query.subscribe(query => {
      this.filterPokemonList(query);
    });
  }

  async loadFullList(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    try {
      this.pokemonList = await this.pokemonservice.getByPage();
      this.filteredPokemonList = [...this.pokemonList]; // Initially show the full list
    } catch (error) {
      console.error('Error loading Pokémon list:', error);
    } finally {
      this.loading = false;
    }
  }

  filterPokemonList(query: string): void {
    if (!query.trim()) {
      this.filteredPokemonList = [...this.pokemonList]; // If query is empty, show full list
    } else {
      this.filteredPokemonList = this.pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

}
