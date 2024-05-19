import { Component, Input, OnChanges } from '@angular/core';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { Pokemon, PokemonInfo } from '../../interfaces/pokemonModel';
import { AuthService } from 'src/app/services/auth.service';
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.css']
})
export class CardGridComponent implements OnChanges {

  showCheckIcon = false;
  userID: string | null = null; // Initialize with null

  constructor(
    private pokemonService: PokemonAPIService,
    private pokedexFirestoreService: PokedexFirestoreService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.authService.getCurrentUserId().then(userId => {
      this.userID = userId;
    });
  }

  ngOnChanges(): void {
    this.extractPokemonData();
  }

  @Input() pokemonData?: any; // Replace with your pokemonData type
  fullPokemonData: Pokemon | undefined;
  pokemonId: string = "0";
  pokemonSprites: string[] = [];

  async extractPokemonData() {
    if (this.pokemonData) {
      this.pokemonId = this.pokemonData.url.substring(34, this.pokemonData.url.length - 1);
      try {
        // Fetch full Pokemon data by ID
        this.fullPokemonData = await this.pokemonService.getById(this.pokemonId);
        // Extract sprites from the full Pokemon data
        if (this.fullPokemonData && this.fullPokemonData.sprites) {
          this.pokemonSprites.push(this.fullPokemonData.sprites.front_default);
          // Add other sprite URLs as needed
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        
      }
    }
  }

  async addToPokedex(pokemonInfo: PokemonInfo): Promise<void> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
  
      this.toastr.warning('You need to be logged in to add your Pokémon', 'Login Required');
      return;
    }

    // Ensure userID is available before adding to Firebase
    await this.authService.getCurrentUserId().then(userId => {
      this.userID = userId;
    });

    if (!this.userID) {
      this.toastr.warning('Please log in', 'Try Again');
      return;
    }

    // Add the Pokemon directly to Firebase
    this.pokedexFirestoreService.addPokemonForUser(this.userID, pokemonInfo)
      .then(() => {
        
        this.toastr.success('', 'Pokemon Added to Pokédex');
      })
      .catch(error => console.error('Error adding Pokémon to Firebase:', error));
      
  }
}
