import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { PokemonInfo } from '../interfaces/pokemonModel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokedexFirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // Add a Pokémon to the user's pokedex
  addPokemonForUser(userID: string, pokemon: PokemonInfo): Promise<DocumentReference<PokemonInfo>> {
    const userPokemonRef = this.firestore.collection<PokemonInfo>(`users/${userID}/pokedex`);
    return userPokemonRef.add(pokemon);
  }

  // Get all Pokémon from the user's pokedex with document IDs
  getAllPokemonForUser(userID: string): Observable<(PokemonInfo & { docId: string })[]> {
    const userPokemonRef = this.firestore.collection(`users/${userID}/pokedex`);
    return userPokemonRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as PokemonInfo;
          const docId = a.payload.doc.id;
          return { ...data, docId } as PokemonInfo & { docId: string };
        });
      })
    );
  }

// Delete a Pokémon from the user's pokedex
  deletePokemonForUser(userID: string, pokemonID: string): Promise<void> {
    const userPokemonRef = this.firestore.collection(`users`).doc(userID).collection('pokedex');
    return userPokemonRef.doc(pokemonID.toString()).delete();
  }
  
}
