import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './screens/home/home.component';
import { GridVisualizerComponent } from './components/grid-visualizer/grid-visualizer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GridVisualizerComponent,
    NavbarComponent,
    CardGridComponent,
    SearchBarComponent,
    PokedexComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
