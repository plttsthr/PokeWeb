import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { PokemonInfo } from '../../interfaces/pokemonModel';
import { SearchService } from '../../services/search-bar.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnDestroy {

  firebasePokemons: (PokemonInfo & { docId?: string })[] = [];
  pokemonWithSprites: (PokemonInfo & { docId?: string; spriteUrl?: string })[] = [];
  selectedPokemon: PokemonInfo | undefined;
  selectedPokemonDetails: { height: number; weight: number; types: string[] } = { height: 0, weight: 0, types: [] };
  selectedPokemonDescription: string = '';
  userID: string | null = null; // Initialize with null
  filteredPokemonList: (PokemonInfo & { docId?: string; spriteUrl?: string })[] = [];
  private searchSubscription: Subscription | undefined;
  loading: boolean = true; // Add a loading state variable

  constructor(
    private pokemonService: PokemonAPIService,
    private pokedexFirestoreService: PokedexFirestoreService,
    private authService: AuthService,
    private searchService: SearchService,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadUserID();
    if (this.userID) {
      await this.loadFirebasePokemons();
      await this.loadSpritesForPokemons();
      this.filteredPokemonList = [...this.pokemonWithSprites];
      this.loading = false; // Set loading to false after data is loaded

      this.searchSubscription = this.searchService.query.subscribe(query => {
        this.filterPokemonList(query);
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from search query when component is destroyed
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  async loadUserID(): Promise<void> {
    this.userID = await this.authService.getCurrentUserId();
  }

  loadFirebasePokemons(): void {
    this.pokedexFirestoreService.getAllPokemonForUser(this.userID!).subscribe(async (pokemonsFire: (PokemonInfo & { docId?: string })[]) => {
      this.firebasePokemons = pokemonsFire;
      await this.loadSpritesForPokemons();
      this.filteredPokemonList = [...this.pokemonWithSprites];
      this.loading = false; // Set loading to false after data is loaded

      // Select the first Pokémon after loading
      if (this.filteredPokemonList.length > 0) {
        this.selectPokemon(this.filteredPokemonList[0]);
      }

    });
  }

  async loadSpritesForPokemons(): Promise<void> {
    this.pokemonWithSprites = []; // Clear existing data

    for (let i = 0; i < this.firebasePokemons.length; i++) {
      const pokemon = this.firebasePokemons[i];

      const spriteUrl = await this.getSpriteUrl(pokemon.id);
      this.pokemonWithSprites.push({ ...pokemon, spriteUrl });
    }
  }

  async getSpriteUrl(id: string): Promise<string | undefined> {
    try {
      const fullPokemonData = await this.pokemonService.getById(id);
      return fullPokemonData.sprites?.front_default;
    } catch (error: any) {
      console.error(`Error fetching sprite for Pokémon with ID ${id} from the API:`, error);
      return undefined;
    }
  }

  selectPokemon(pokemon: PokemonInfo & { id: string }): void {
    this.selectedPokemon = pokemon;
    this.loadPokemonDetails(pokemon);
    this.loadPokemonDescription(pokemon);
  }

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

  async loadPokemonDescription(pokemon: PokemonInfo & { id: string }): Promise<void> {
    try {
      this.selectedPokemonDescription = await this.pokemonService.getPokemonDescription(pokemon.id);
    } catch (error: any) {
      console.error(`Error fetching description for Pokémon with ID ${pokemon.id}:`, error);
    }
  }

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
        this.loadFirebasePokemons(); // Reload the Pokemon list after deletion
      })
      .catch((error) => {
        console.error(`Error deleting Pokemon ${pokemon.name}:`, error);
        // Optionally show an error message
      });
  }

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
      this.selectedPokemon = undefined; // Clear the selection if no Pokémon matches the search query
      this.selectedPokemonDetails = { height: 0, weight: 0, types: [] };
      this.selectedPokemonDescription = '';
    }
  }
}
