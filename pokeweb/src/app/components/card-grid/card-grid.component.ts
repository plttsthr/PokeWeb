// Angular core imports for component functionality
import { Component, Input, OnChanges } from '@angular/core';
// Service for interacting with the Pokémon API
import { PokemonAPIService } from '../../services/pokemon-api.service';
// Interfaces for Pokémon data models
import { Pokemon, PokemonInfo } from '../../interfaces/pokemonModel';
// Service for authentication
import { AuthService } from 'src/app/services/auth.service';
// Service for Firestore operations related to Pokédex
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
// Service for displaying toast notifications
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.css']
})
export class CardGridComponent implements OnChanges {
  // Flag to show check icon
  showCheckIcon = false;
  // Variable to hold the current user ID
  userID: string | null = null;

  // Constructor to inject necessary services
  constructor(
    private pokemonService: PokemonAPIService,
    private pokedexFirestoreService: PokedexFirestoreService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    // Fetch and set the current user ID upon component initialization
    this.authService.getCurrentUserId().then(userId => {
      this.userID = userId;
    });
  }

  // Lifecycle hook to handle changes to the input properties
  ngOnChanges(): void {
    this.extractPokemonData();
  }

  // Input property to receive Pokémon data
  @Input() pokemonData?: any; 
  // Variables to hold full Pokémon data, ID, and sprites
  fullPokemonData: Pokemon | undefined;
  pokemonId: string = "0";
  pokemonSprites: string[] = [];

  // Method to extract and fetch Pokémon data based on the input
  async extractPokemonData() {
    if (this.pokemonData) {
      // Extract Pokémon ID from the URL
      this.pokemonId = this.pokemonData.url.substring(34, this.pokemonData.url.length - 1);
      try {
        // Fetch full Pokémon data by ID
        this.fullPokemonData = await this.pokemonService.getById(this.pokemonId);
        // Extract sprites from the full Pokémon data
        if (this.fullPokemonData && this.fullPokemonData.sprites) {
          this.pokemonSprites.push(this.fullPokemonData.sprites.front_default);
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    }
  }

  // Method to add Pokémon to the user's Pokédex in Firestore
  async addToPokedex(pokemonInfo: PokemonInfo): Promise<void> {
    // Check if the user is logged in
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      // Show a warning if the user is not logged in
      this.toastr.warning('You need to be logged in to add your Pokémon', 'Login Required');
      return;
    }

    // Ensure userID is available before adding to Firestore
    await this.authService.getCurrentUserId().then(userId => {
      this.userID = userId;
    });

    if (!this.userID) {
      // Show a warning if the user ID is not available
      this.toastr.warning('Please log in', 'Try Again');
      return;
    }

    // Add the Pokémon directly to Firestore for the current user
    this.pokedexFirestoreService.addPokemonForUser(this.userID, pokemonInfo)
      .then(() => {
        // Show a success message upon successful addition
        this.toastr.success('', 'Pokemon Added to Pokédex');
      })
      .catch(error => console.error('Error adding Pokémon to Firebase:', error));
  }
}
