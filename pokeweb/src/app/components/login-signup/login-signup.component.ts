// Angular core imports for component functionality and form handling
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Firebase Authentication service
import { AngularFireAuth } from '@angular/fire/compat/auth';
// Custom authentication service
import { AuthService } from 'src/app/services/auth.service';
// Interface for Pokémon data models
import { PokemonInfo } from '../../interfaces/pokemonModel';
// Service for Firestore operations related to Pokédex
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
// RxJS subscription for managing observable subscriptions
import { Subscription } from 'rxjs';
// Service for displaying toast notifications
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit, OnDestroy {
  
  // Form groups for registration and login forms
  registerUser: FormGroup;
  loginUser: FormGroup;
  // State variable to track if the user is logged in
  isLoggedIn: boolean = false;
  // Variable to hold the current user ID
  userID: string | null = null;
  // Subscription to auth state changes
  private authStateSubscription: Subscription | null = null;
  
  // Constructor to inject necessary services
  constructor(
    private fbs: FormBuilder,
    private afireAuthSignUp: AngularFireAuth,
    private fbl: FormBuilder,
    private afireAuthLogin: AngularFireAuth,
    private authService: AuthService,
    private toastr: ToastrService,
    private pokedexFirestoreService: PokedexFirestoreService,
  ) {
    // Initialize registration form with validators
    this.registerUser = this.fbs.group({
      emailSignUp: ['', [Validators.required, Validators.email]],
      passwordSignUp: ['', [Validators.required, Validators.minLength(6)]],
      confirmPasswordSignUp: ['', Validators.required],
    });

    // Initialize login form with validators
    this.loginUser = this.fbl.group({
      emailLogin: ['', Validators.required],
      passwordLogin: ['', Validators.required],
    });
  }

  // Lifecycle hook to perform initialization logic
  ngOnInit(): void {
    // Subscribe to auth state changes to update isLoggedIn
    this.authStateSubscription = this.authService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  // Lifecycle hook to clean up subscriptions
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  // Method to handle user sign up
  SignUp() {
    const emailToRegister = this.registerUser.value.emailSignUp;
    const passwordToRegister = this.registerUser.value.passwordSignUp;
    const confirmPasswordToRegister = this.registerUser.value.confirmPasswordSignUp;
  
    if (passwordToRegister !== confirmPasswordToRegister) {
      this.toastr.error('Passwords do not match', 'Error');
    } else {
      // Create user account in Firebase Authentication
      this.afireAuthSignUp.createUserWithEmailAndPassword(emailToRegister, passwordToRegister)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          this.toastr.success('User registered successfully', 'Hello');
  
          // Add default Pokémon to Firebase
          const defaultPokemon: PokemonInfo = {
            id: '25',  // Example Pokémon ID
            name: 'pikachu',  // Example Pokémon name
          };
  
          if (!user) {
            this.toastr.warning('Please log in', 'Try Again');
            return;
          }
          // Add default Pokémon to user's Pokédex
          this.addDefaultPokemonToPokedex(user.uid, defaultPokemon);
  
          // Short delay before refreshing the page
          setTimeout(() => {
            this.refreshPage();
          }, 1000); // 1000 milliseconds = 1 second
        })
        .catch((error) => {
          console.error(error);
          this.handleError(error);
        });
    }
  }
  
  // Method to handle Firebase Authentication errors
  handleError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.toastr.error('The email address is already in use by another account.', 'Error');
        break;
      case 'auth/invalid-email':
        this.toastr.error('The email address is not valid.', 'Error');
        break;
      case 'auth/operation-not-allowed':
        this.toastr.error('Email/password accounts are not enabled.', 'Error');
        break;
      case 'auth/weak-password':
        this.toastr.error('The password is too weak.', 'Error');
        break;
      default:
        this.toastr.error('Error signing up. Please try again', 'Error');
        break;
    }
  }
  
  // Method to add a default Pokémon to the user's Pokédex in Firestore
  addDefaultPokemonToPokedex(userId: string, pokemonInfo: PokemonInfo): void {
    this.pokedexFirestoreService.addPokemonForUser(userId, pokemonInfo)
      .then(() => {
        console.log('Default Pokémon added to Pokédex');
      })
      .catch(error => {
        console.error('Error adding default Pokémon to Pokédex:', error);
        this.toastr.error('Error adding default Pokémon', 'Error');
      });
  }

  // Method to load the current user ID
  async loadUserID(): Promise<void> {
    this.userID = await this.authService.getCurrentUserId();
  }

  // Method to handle user login
  Login() {
    const emailToLogin = this.loginUser.value.emailLogin;
    const passwordToLogin = this.loginUser.value.passwordLogin;

    this.afireAuthLogin.signInWithEmailAndPassword(emailToLogin, passwordToLogin).then((user) => {
      console.log(user);
      // Refresh the page after a short delay
      setTimeout(() => {
        this.refreshPage();
      }, 1000); // 1000 milliseconds = 1 second

      this.toastr.success('', 'Welcome');
    }).catch((error) => {
      console.error(error);
      this.toastr.error('Error logging in. Please try again', 'Error');
    });
  }

  // Method to handle user logout
  async Logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.isLoggedIn = false;
      
      // Refresh the page after a short delay
      setTimeout(() => {
        this.refreshPage();
      }, 1000); // 1000 milliseconds = 1 second

      this.toastr.success('', 'See you soon');
    } catch (error) {
      console.error('Error logging out:', error);
      this.toastr.error('Error logging out', 'Error');
    }
  }

  // Method to refresh the page
  private refreshPage(): void {
    window.location.reload();
  }
}
