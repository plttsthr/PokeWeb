// Angular core module for creating Angular applications
import { NgModule } from '@angular/core';
// BrowserModule to run the application in a web browser
import { BrowserModule } from '@angular/platform-browser';
// RouterModule for routing functionalities
import { RouterModule } from '@angular/router';
// FormsModule and ReactiveFormsModule for template-driven and reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Angular Material modules for UI components
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
// BrowserAnimationsModule for animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// ToastrModule for displaying toast notifications
import { ToastrModule } from 'ngx-toastr';
// AppRoutingModule for application routing
import { AppRoutingModule } from './app-routing.module';

// Application root component
import { AppComponent } from './app.component';
// Home screen component
import { HomeComponent } from './screens/home/home.component';
// Grid visualizer component
import { GridVisualizerComponent } from './components/grid-visualizer/grid-visualizer.component';
// Navigation bar component
import { NavbarComponent } from './components/navbar/navbar.component';
// Card grid component
import { CardGridComponent } from './components/card-grid/card-grid.component';
// Search bar component
import { SearchBarComponent } from './components/search-bar/search-bar.component';
// Pokedex component
import { PokedexComponent } from './components/pokedex/pokedex.component';
// Login and signup component
import { LoginSignupComponent } from './components/login-signup/login-signup.component';

// AngularFire modules for Firebase integration
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Services for authentication and Pokedex Firestore operations
import { AuthService } from 'src/app/services/auth.service';
import { PokedexFirestoreService } from 'src/app/services/pokedex-firestore.service';

// Environment configuration for Firebase
import { environment } from 'src/environments/environment';

// Additional providers for animations and toastr
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

@NgModule({
  declarations: [
    // Declaration of components used in the application
    AppComponent,
    HomeComponent,
    GridVisualizerComponent,
    NavbarComponent,
    CardGridComponent,
    SearchBarComponent,
    PokedexComponent,
    LoginSignupComponent,
  ],
  imports: [
    // Importing necessary Angular and third-party modules
    BrowserModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ // ToastrModule configuration
      timeOut: 3000,
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    })
  ],
  providers: [
    // Providing services used in the application
    AuthService,
    PokedexFirestoreService,
    provideAnimationsAsync(),
    provideAnimations(),
    provideToastr(),
  ],
  // Bootstrap the root component
  bootstrap: [AppComponent]
})
export class AppModule { }
