// Import Injectable decorator from Angular core
import { Injectable } from '@angular/core';
// Import BehaviorSubject from RxJS for creating observable query state
import { BehaviorSubject } from 'rxjs';

// Injectable decorator to make this service available for dependency injection
@Injectable({
  providedIn: 'root' // Specifies that this service is provided at the root level
})
export class SearchService {
  // Private BehaviorSubject to hold the current search query state
  private _query: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Constructor method
  constructor() {}

  // Getter for the query BehaviorSubject
  get query(): BehaviorSubject<string> {
    return this._query;
  }

  // Method to set the search query
  setQuery(query: string): void {
    // Update the BehaviorSubject with the new query
    this._query.next(query);
  }

  // Placeholder method for searching Pokémon
  searchPokemon(query: string): void {
    // Implement your search logic here
    console.log('Searching for:', query);
    // You can call your API service or perform any other search operation here
  }
}
