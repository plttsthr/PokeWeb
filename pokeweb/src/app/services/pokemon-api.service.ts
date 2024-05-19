// Import Injectable decorator from Angular core
import { Injectable } from '@angular/core';
// Import necessary interfaces for type annotations
import { Data, resultArray } from '../interfaces/pokemonAPI';
import { Pokemon } from '../interfaces/pokemonModel';

// Injectable decorator to make this service available for dependency injection
@Injectable({
  providedIn: 'root' // Specifies that this service is provided at the root level
})
export class PokemonAPIService {

  // Constructor method
  constructor()  {}

  // Fetch a list of Pokémon with pagination
  async getByPage(): Promise<resultArray[]> {
    // Fetch data from the Pokémon API with a limit of 500 Pokémon
    const result = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=500&offset=0");
    const resultJson = await result.json();

    // Check if results are returned and return them, otherwise return an empty array
    if (resultJson.results.length > 0) return resultJson.results;
    return [];
  }

  // Fetch detailed Pokémon data by ID
  async getById(id: string | number): Promise<Pokemon> {
    // Fetch data from the Pokémon API for a specific Pokémon by ID
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const resultJson = await result.json();

    // Return the detailed Pokémon data
    return resultJson;
  }

  // Search for a Pokémon by name or ID
  async searchPokemon(query: string): Promise<resultArray[]> {
    // Fetch data from the Pokémon API for a specific Pokémon by name or ID
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    const resultJson = await result.json();

    // Return the search results
    return resultJson.results;
  }

  // Fetch Pokémon description by ID
  async getPokemonDescription(id: string | number): Promise<string> {
    try {
      // Fetch species data from the Pokémon API for a specific Pokémon by ID
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      const resultJson = await res.json();
      
      // Extract and return the English flavor text description
      return resultJson.flavor_text_entries.find((entry: any) => entry.language.name === "en").flavor_text;
    } catch (error) {
      console.error(`Error fetching description for Pokémon with ID ${id}:`, error);
      return ''; // Return an empty string on error
    }
  }
}
