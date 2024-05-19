import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokedexComponent } from './pokedex.component';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from '../../services/search-bar.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { PokemonInfo } from '../../interfaces/pokemonModel';

describe('PokedexComponent', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let pokemonAPIService: jasmine.SpyObj<PokemonAPIService>;
  let pokedexFirestoreService: jasmine.SpyObj<PokedexFirestoreService>;
  let authService: jasmine.SpyObj<AuthService>;
  let searchService: jasmine.SpyObj<SearchService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const pokemonAPIServiceSpy = jasmine.createSpyObj('PokemonAPIService', ['getById', 'getPokemonDescription']);
    const pokedexFirestoreServiceSpy = jasmine.createSpyObj('PokedexFirestoreService', ['getAllPokemonForUser', 'deletePokemonForUser']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserId']);
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['query']);

    await TestBed.configureTestingModule({
      declarations: [ PokedexComponent ],
      imports: [
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: PokemonAPIService, useValue: pokemonAPIServiceSpy },
        { provide: PokedexFirestoreService, useValue: pokedexFirestoreServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) }
      ]
    })
    .compileComponents();

    pokemonAPIService = TestBed.inject(PokemonAPIService) as jasmine.SpyObj<PokemonAPIService>;
    pokedexFirestoreService = TestBed.inject(PokedexFirestoreService) as jasmine.SpyObj<PokedexFirestoreService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user ID and Pokémon from Firestore on initialization', async () => {
    const userId = 'testUserId';
    const pokemonList: PokemonInfo[] = [
      { id: '1', name: 'bulbasaur' },
      { id: '2', name: 'ivysaur' }
    ];
    const pokemonWithDocIds: (PokemonInfo & { docId: string })[] = pokemonList.map(pokemon => ({ ...pokemon, docId: 'mockDocId' }));

    authService.getCurrentUserId.and.returnValue(Promise.resolve(userId));
    pokedexFirestoreService.getAllPokemonForUser.and.returnValue(of(pokemonList));

    await component.ngOnInit();

    expect(authService.getCurrentUserId).toHaveBeenCalled();
    expect(pokedexFirestoreService.getAllPokemonForUser).toHaveBeenCalledWith(userId);
    expect(component.firebasePokemons).toEqual(pokemonWithDocIds);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading user ID and Pokémon from Firestore', async () => {
    authService.getCurrentUserId.and.returnValue(Promise.reject('Error loading user ID'));
    pokedexFirestoreService.getAllPokemonForUser.and.returnValue(of([]));

    await component.ngOnInit();

    expect(authService.getCurrentUserId).toHaveBeenCalled();
    expect(pokedexFirestoreService.getAllPokemonForUser).not.toHaveBeenCalled();
    expect(component.loading).toBeTrue();
  });
});

