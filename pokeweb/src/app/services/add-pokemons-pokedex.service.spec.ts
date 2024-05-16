import { TestBed } from '@angular/core/testing';

import { AddPokemonsPokedexService } from './add-pokemons-pokedex.service';

describe('AddPokemonsPokedexService', () => {
  let service: AddPokemonsPokedexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPokemonsPokedexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
