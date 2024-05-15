import { Injectable } from '@angular/core';
import { Data, resultArray } from '../interfaces/pokemonAPI';
import { Pokemon } from '../interfaces/pokemonModel';


@Injectable({
  providedIn: 'root'
})
export class PokemonAPIService {

  constructor()  {}

  async getByPage():Promise<resultArray[]>{
    const result = await fetch("https://pokeapi.co/api/v2/ability/?limit=100&offset=0");
    const resultJson = await result.json();
    console.log(resultJson);
    if(resultJson.results.length > 0) return resultJson.results
    return [];
  }

  // async getById(id : string | number):Promise<Pokemon>{
  //   const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  //   return await res.json();
  // }

  // async getPokemonDescription(id: string | number):Promise<string>{
  //   const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  //   const resJson = await res.json();
  //   const texto = resJson.flavor_text_entries.find((texto:any) =>  texto.language.name === "es")
  //   return texto ? texto.flavor_text : "No se econtró descripción en español";
  // }

}

