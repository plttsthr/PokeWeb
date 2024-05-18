import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './screens/home/home.component';
import { GridVisualizerComponent } from './components/grid-visualizer/grid-visualizer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { PokedexFirestoreService } from 'src/app/services/pokedex-firestore.service';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
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
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
  ],
  providers: [
    AuthService,
    PokedexFirestoreService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
