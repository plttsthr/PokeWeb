import { Injectable } from '@angular/core';
import { Data, resultArray } from '../interfaces/pokemonAPI';
import { Pokemon } from '../interfaces/pokemonModel';


@Injectable({
  providedIn: 'root'
})
export class PokemonAPIService {

  constructor()  {}

  async getByPage():Promise<resultArray[]>{
    const result = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=500&offset=0");
    const resultJson = await result.json();

    if(resultJson.results.length > 0) return resultJson.results
    return [];
  }

  async getById(id: string | number): Promise<Pokemon> {
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const resultJson = await result.json();

    return resultJson;
  }
  
  async searchPokemon(query: string): Promise<resultArray[]> {
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
    const resultJson = await result.json();

    return resultJson.results;
  }

  async getPokemonDescription(id: string | number): Promise<string> {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const resultJson = await res.json();
        // Extract the description from the resultJson and return it
        return resultJson.flavor_text_entries.find((entry: any) => entry.language.name === "en").flavor_text;
    } catch (error) {
        console.error(`Error fetching description for Pokémon with ID ${id}:`, error);
        return ''; // Return an empty string on error
    }
}

}

