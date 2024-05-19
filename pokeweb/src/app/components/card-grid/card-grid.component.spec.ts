import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, Input, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of } from 'rxjs';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
import { AuthService } from 'src/app/services/auth.service';

// Mock the ToastrService
class MockToastrService {
  warning(message?: string, title?: string) {}
  success(message?: string, title?: string) {}
}

// Mock the PokemonAPIService
class MockPokemonAPIService {
  getById(id: string) {
    return Promise.resolve({ id, sprites: { front_default: 'mock_sprite_url' } });
  }
}

// Mock the PokedexFirestoreService
class MockPokedexFirestoreService {
  addPokemonForUser(userId: string, pokemonInfo: any) {
    return Promise.resolve();
  }
}

// Mock the AuthService
class MockAuthService {
  getCurrentUserId() {
    return Promise.resolve('mockUserId');
  }
  isLoggedIn() {
    return Promise.resolve(true);
  }
}

// Test Component
@Component({
  selector: 'app-card-grid',
  template: '',
})
class TestCardGridComponent implements OnChanges {
  @Input() pokemonData?: any;

  fullPokemonData: any;
  pokemonId: string = "0";
  pokemonSprites: string[] = [];
  userID: string | null = null;

  constructor(
    private pokemonService: PokemonAPIService,
    private pokedexFirestoreService: PokedexFirestoreService,
    private authService: AuthService,
    private toastr: ToastrService // Make toastr public for testing
  ) {}

  ngOnChanges(): void {
    this.extractPokemonData();
  }

  async extractPokemonData() {
    if (this.pokemonData) {
      this.pokemonId = this.pokemonData.url.substring(34, this.pokemonData.url.length - 1);
      try {
        this.fullPokemonData = await this.pokemonService.getById(this.pokemonId);
        if (this.fullPokemonData && this.fullPokemonData.sprites) {
          this.pokemonSprites.push(this.fullPokemonData.sprites.front_default);
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    }
  }

  async addToPokedex(pokemonInfo: any): Promise<void> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.toastr.warning('You need to be logged in to add your Pokémon', 'Login Required');
      return;
    }

    await this.authService.getCurrentUserId().then(userId => {
      this.userID = userId;
    });

    if (!this.userID) {
      this.toastr.warning('Please log in', 'Try Again');
      return;
    }

    this.pokedexFirestoreService.addPokemonForUser(this.userID, pokemonInfo)
      .then(() => {
        this.toastr.success('', 'Pokemon Added to Pokédex');
      })
      .catch(error => console.error('Error adding Pokémon to Firebase:', error));
  }
}

describe('CardGridComponent', () => {
  let component: TestCardGridComponent;
  let fixture: ComponentFixture<TestCardGridComponent>;
  let authService: AuthService;
  let pokedexFirestoreService: PokedexFirestoreService;
  let toastrService: ToastrService; // Added ToastrService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCardGridComponent ],
      providers: [
        { provide: PokemonAPIService, useClass: MockPokemonAPIService },
        { provide: PokedexFirestoreService, useClass: MockPokedexFirestoreService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ToastrService, useClass: MockToastrService } // Mock ToastrService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCardGridComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    pokedexFirestoreService = TestBed.inject(PokedexFirestoreService);
    toastrService = TestBed.inject(ToastrService); // Inject ToastrService
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract Pokémon data when ngOnChanges is called', () => {
    const mockPokemonData = { url: 'https://pokeapi.co/api/v2/pokemon/1/' };
    component.pokemonData = mockPokemonData;
    component.ngOnChanges();
    expect(component.pokemonId).toBe('1');
    expect(component.fullPokemonData.id).toBe('1');
    expect(component.pokemonSprites.length).toBe(1);
    expect(component.pokemonSprites[0]).toBe('mock_sprite_url');
  });

  it('should add Pokémon to the Pokédex', fakeAsync(() => {
    const mockPokemonInfo = { id: '1', name: 'bulbasaur' };
    const toastrSpy = spyOn(toastrService, 'success');
    component.addToPokedex(mockPokemonInfo);
    tick(); // Wait for promises to resolve
    expect(component.userID).toBe('mockUserId');
    expect(toastrSpy).toHaveBeenCalledOnceWith('', 'Pokemon Added to Pokédex');
  }));

  it('should show warning when user is not logged in', fakeAsync(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(Promise.resolve(false));
    const toastrSpy = spyOn(toastrService, 'warning');
    component.addToPokedex({ id: '1', name: 'bulbasaur' });
    tick(); // Wait for promises to resolve
    expect(toastrSpy).toHaveBeenCalledOnceWith('You need to be logged in to add your Pokémon', 'Login Required');
  }));

  it('should show warning when userID is not available', fakeAsync(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(Promise.resolve(true));
    spyOn(authService, 'getCurrentUserId').and.returnValue(Promise.resolve(null));
    const toastrSpy = spyOn(toastrService, 'warning');
    component.addToPokedex({ id: '1', name: 'bulbasaur' });
    tick(); // Wait for promises to resolve
    expect(toastrSpy).toHaveBeenCalledOnceWith('Please log in', 'Try Again');
  }));

  it('should handle error when adding Pokémon to Pokédex fails', fakeAsync(() => {
    spyOn(pokedexFirestoreService, 'addPokemonForUser').and.returnValue(Promise.reject('Firebase error'));
    const consoleSpy = spyOn(console, 'error');
    component.addToPokedex({ id: '1', name: 'bulbasaur' });
    tick(); // Wait for promises to resolve
    expect(consoleSpy).toHaveBeenCalledOnceWith('Error adding Pokémon to Firebase:', 'Firebase error');
  }));
});
