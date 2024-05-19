// Angular core imports for component functionality
import { Component, OnInit } from '@angular/core';
// Service for interacting with the Pokémon API
import { PokemonAPIService } from '../../services/pokemon-api.service';
// Interface for the structure of the Pokémon API response
import { resultArray } from '../../interfaces/pokemonAPI';
// Service for handling search queries
import { SearchService } from '../../services/search-bar.service';

@Component({
  selector: 'app-grid-visualizer',
  templateUrl: './grid-visualizer.component.html',
  styleUrls: ['./grid-visualizer.component.css']
})
export class GridVisualizerComponent implements OnInit {

  // Constructor to inject necessary services
  constructor(
    private pokemonService: PokemonAPIService, 
    private searchService: SearchService
  ) {}

  // Variables to hold the list of Pokémon, loading state, and filtered list
  pokemonList: resultArray[] = [];
  loading: boolean = false;
  filteredPokemonList: resultArray[] = [];

  // Lifecycle hook to perform initialization logic
  ngOnInit(): void {
    // Load the full list of Pokémon when the component initializes
    this.loadFullList();
    // Subscribe to the search query and filter the Pokémon list accordingly
    this.searchService.query.subscribe(query => {
      this.filterPokemonList(query);
    });
  }

  // Method to load the full list of Pokémon
  async loadFullList(): Promise<void> {
    // Avoid loading if already in progress
    if (this.loading) return;
    this.loading = true;
    try {
      // Fetch the Pokémon list from the service
      this.pokemonList = await this.pokemonService.getByPage();
      // Initialize the filtered list to the full list
      this.filteredPokemonList = [...this.pokemonList];
    } catch (error) {
      console.error('Error loading Pokémon list:', error);
    } finally {
      this.loading = false;
    }
  }

  // Method to filter the Pokémon list based on a search query
  filterPokemonList(query: string): void {
    if (!query.trim()) {
      // If the search query is empty, reset to the full list
      this.filteredPokemonList = [...this.pokemonList];
    } else {
      // Filter the list based on the query
      this.filteredPokemonList = this.pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}
