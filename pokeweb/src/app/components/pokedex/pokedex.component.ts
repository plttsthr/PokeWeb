// Angular core imports for component lifecycle management
import { Component, OnInit, OnDestroy } from '@angular/core';
// Custom services for API interaction, Firestore operations, authentication, and search functionality
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from '../../services/search-bar.service';
// Interface for Pokémon data models
import { PokemonInfo } from '../../interfaces/pokemonModel';
// RxJS subscription for managing observable subscriptions
import { Subscription } from 'rxjs';
// Service for displaying toast notifications
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnDestroy {
  
  // Arrays to store Pokémon data
  firebasePokemons: (PokemonInfo & { docId?: string })[] = [];
  pokemonWithSprites: (PokemonInfo & { docId?: string; spriteUrl?: string })[] = [];
  // Selected Pokémon details
  selectedPokemon: PokemonInfo | undefined;
  selectedPokemonDetails: { height: number; weight: number; types: string[] } = { height: 0, weight: 0, types: [] };
  selectedPokemonDescription: string = '';
  // Current user ID
  userID: string | null = null;
  // Filtered list of Pokémon based on search query
  filteredPokemonList: (PokemonInfo & { docId?: string; spriteUrl?: string })[] = [];
  // Subscription to search query changes
  private searchSubscription: Subscription | undefined;
  // Subscription to getAuthstate
  private authSubscription: Subscription | undefined;
  // Loading state
  loading: boolean = true;

  // Constructor to inject necessary services
  constructor(
    private pokemonService: PokemonAPIService,
    private pokedexFirestoreService: PokedexFirestoreService,
    private authService: AuthService,
    private searchService: SearchService,
    private toastr: ToastrService
  ) {}

  // Lifecycle hook to perform initialization logic
  ngOnInit(): void {
    // Subscribe to the auth state observable
    this.authSubscription = this.authService.getAuthState().subscribe(async (user) => {
      this.loading = true;
      if (user) {
        this.userID = user.uid;
        await this.loadFirebasePokemons();
        this.filteredPokemonList = [...this.pokemonWithSprites];
        this.loading = false;

        // Subscribe to search query changes
        this.searchSubscription = this.searchService.query.subscribe(query => {
          this.filterPokemonList(query);
        });
      } else {
        this.userID = null;
        this.loading = false;
      }
    });
  }

  // Lifecycle hook to clean up subscriptions
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Method to load the current user ID
  async loadUserID(): Promise<void> {
    this.userID = await this.authService.getCurrentUserId();
  }

  // Method to load Pokémon from Firestore
loadFirebasePokemons(): void {
  this.loading = true;
  this.pokedexFirestoreService.getAllPokemonForUser(this.userID!).subscribe({
    next: async (pokemonsFire: (PokemonInfo & { docId?: string })[]) => {
      try {
        this.firebasePokemons = pokemonsFire;
        await this.loadSpritesForPokemons();
        this.filteredPokemonList = [...this.pokemonWithSprites];
        this.loading = false; // Set loading to false after data is loaded

        // Select the first Pokémon after loading
        if (this.filteredPokemonList.length > 0) {
          this.selectPokemon(this.filteredPokemonList[0]);
        }
      } catch (error) {
        console.error('Error loading sprites for Pokémon:', error);
        this.loading = false;
      }
    },
    error: (error) => {
      console.error('Error loading Pokémon from Firestore:', error);
      this.loading = false;
    }
  });
}

  // Method to load sprites for the Pokémon
  async loadSpritesForPokemons(): Promise<void> {
    this.pokemonWithSprites = []; // Clear existing data

    for (let i = 0; i < this.firebasePokemons.length; i++) {
      const pokemon = this.firebasePokemons[i];
      const spriteUrl = await this.getSpriteUrl(pokemon.id);
      this.pokemonWithSprites.push({ ...pokemon, spriteUrl });
    }
  }

  // Method to get the sprite URL for a Pokémon by its ID
  async getSpriteUrl(id: string): Promise<string | undefined> {
    try {
      const fullPokemonData = await this.pokemonService.getById(id);
      return fullPokemonData.sprites?.front_default;
    } catch (error: any) {
      console.error(`Error fetching sprite for Pokémon with ID ${id} from the API:`, error);
      return undefined;
    }
  }

  // Method to select a Pokémon and load its details and description
  selectPokemon(pokemon: PokemonInfo & { id: string }): void {
    this.selectedPokemon = pokemon;
    this.loadPokemonDetails(pokemon);
    this.loadPokemonDescription(pokemon);
  }

  // Method to load details for a selected Pokémon
  async loadPokemonDetails(pokemon: PokemonInfo & { id: string }): Promise<void> {
    try {
      const fullPokemonData = await this.pokemonService.getById(pokemon.id);
      this.selectedPokemonDetails = {
        height: fullPokemonData.height,
        weight: fullPokemonData.weight,
        types: fullPokemonData.types.map((type: any) => type.type.name)
      };
    } catch (error: any) {
      console.error(`Error fetching details for Pokémon with ID ${pokemon.id}:`, error);
    }
  }

  // Method to load the description for a selected Pokémon
  async loadPokemonDescription(pokemon: PokemonInfo & { id: string }): Promise<void> {
    try {
      this.selectedPokemonDescription = await this.pokemonService.getPokemonDescription(pokemon.id);
    } catch (error: any) {
      console.error(`Error fetching description for Pokémon with ID ${pokemon.id}:`, error);
    }
  }

  // Method to delete a Pokémon from Firestore
  deletePokemon(event: Event, pokemon: PokemonInfo & { docId?: string }): void {
    event.stopPropagation(); // Prevent event bubbling up to the card body

    if (!this.userID || !pokemon.docId) {
      console.error('Cannot delete Pokemon: userID or docId is missing');
      return;
    }

    this.pokedexFirestoreService.deletePokemonForUser(this.userID, pokemon.docId)
      .then(() => {
        console.log(`Pokemon ${pokemon.id} deleted successfully!`);
        this.toastr.success('', 'Pokemon Deleted');
        this.loadFirebasePokemons(); // Reload the Pokémon list after deletion
      })
      .catch((error) => {
        console.error(`Error deleting Pokemon ${pokemon.name}:`, error);
        // Optionally show an error message
      });
  }

  // Method to filter the Pokémon list based on a search query
  filterPokemonList(query: string): void {
    if (!query.trim()) {
      this.filteredPokemonList = [...this.pokemonWithSprites]; // If query is empty, show full list
    } else {
      this.filteredPokemonList = this.pokemonWithSprites.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    // Automatically select the first Pokémon in the filtered list if it exists
    if (this.filteredPokemonList.length > 0) {
      this.selectPokemon(this.filteredPokemonList[0]);
    } else {
      // Clear the selection if no Pokémon matches the search query
      this.selectedPokemon = undefined;
      this.selectedPokemonDetails = { height: 0, weight: 0, types: [] };
      this.selectedPokemonDescription = '';
    }
  }
}
