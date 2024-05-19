import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule} from 'ngx-toastr';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';



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
    RouterModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ // ToastrModule added
      timeOut: 3000,
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    })

    
  ],
  providers: [
    AuthService,
    PokedexFirestoreService,
    provideAnimationsAsync(),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
