import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _query: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  get query(): BehaviorSubject<string> {
    return this._query;
  }

  setQuery(query: string): void {
    this._query.next(query);
  }
  searchPokemon(query: string): void {
    // Implement your search logic here
    console.log('Searching for:', query);
    // You can call your API service or perform any other search operation here
  }
}
