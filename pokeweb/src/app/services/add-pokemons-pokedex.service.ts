import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PokemonInfo } from '../interfaces/pokemonModel';

@Injectable({
  providedIn: 'root'
})
export class AddPokemonsPokedexService {
  private addedPokemonsSubject: BehaviorSubject<PokemonInfo[]> = new BehaviorSubject<PokemonInfo[]>([]);
  addedPokemons$ = this.addedPokemonsSubject.asObservable();

  constructor() {}

  addToPokedexList(pokemon: PokemonInfo): void {
    const addedPokemons = this.addedPokemonsSubject.getValue();
    addedPokemons.push(pokemon);
    this.addedPokemonsSubject.next(addedPokemons);
    console.log(addedPokemons);
  }
}
