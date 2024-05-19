// Import Injectable decorator from Angular core
import { Injectable } from '@angular/core';
// Import AngularFirestore and DocumentReference for Firestore operations
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
// Import PokemonInfo interface for type annotations
import { PokemonInfo } from '../interfaces/pokemonModel';
// Import Observable for reactive programming
import { Observable } from 'rxjs';
// Import map operator for transforming data
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Specifies that this service is available throughout the application
})
export class PokedexFirestoreService {

  // Constructor to inject AngularFirestore service
  constructor(private firestore: AngularFirestore) { }

  // Add a Pokémon to the user's pokedex
  addPokemonForUser(userID: string, pokemon: PokemonInfo): Promise<DocumentReference<PokemonInfo>> {
    // Reference to the user's pokedex collection in Firestore
    const userPokemonRef = this.firestore.collection<PokemonInfo>(`users/${userID}/pokedex`);
    // Add the Pokémon to the user's pokedex collection and return a promise
    return userPokemonRef.add(pokemon);
  }

  // Get all Pokémon from the user's pokedex with document IDs
  getAllPokemonForUser(userID: string): Observable<(PokemonInfo & { docId: string })[]> {
    // Reference to the user's pokedex collection in Firestore
    const userPokemonRef = this.firestore.collection(`users/${userID}/pokedex`);
    // Return an observable that emits the list of Pokémon with document IDs
    return userPokemonRef.snapshotChanges().pipe(
      map(actions => {
        // Transform the snapshot actions into a list of Pokémon with document IDs
        return actions.map(a => {
          const data = a.payload.doc.data() as PokemonInfo;
          const docId = a.payload.doc.id;
          // Combine Pokémon data with document ID and return the list
          return { ...data, docId } as PokemonInfo & { docId: string };
        });
      })
    );
  }

  // Delete a Pokémon from the user's pokedex
  deletePokemonForUser(userID: string, pokemonID: string): Promise<void> {
    // Reference to the user's pokedex collection in Firestore
    const userPokemonRef = this.firestore.collection(`users`).doc(userID).collection('pokedex');
    // Delete the Pokémon document from the user's pokedex collection and return a promise
    return userPokemonRef.doc(pokemonID.toString()).delete();
  }
  
}
