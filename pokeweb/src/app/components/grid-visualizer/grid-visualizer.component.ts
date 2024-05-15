import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { PokemonAPIService } from '../../services/pokemon-api.service';
import { resultArray } from '../../interfaces/pokemonAPI';
import { Pokemon } from '../../interfaces/pokemonModel';

@Component({
  selector: 'app-grid-visualizer',
  templateUrl: './grid-visualizer.component.html',
  styleUrls: ['./grid-visualizer.component.css']
})
export class GridVisualizerComponent implements OnInit{

  constructor(private pokemonservice:PokemonAPIService){}

  pokemonList:resultArray[] = [];
  chosenPokemon:Pokemon|undefined;
  page:number = 1;
  loading: boolean = false;
  details: boolean = false;

  ngOnInit(): void {
    this.loadFullList();
    
  }

  async loadFullList(){
    if(this.loading) return;
    this.loading = true;
    this.page++;
    this.loading = false;
    this.pokemonList = await this.pokemonservice.getByPage();
    console.log(this.pokemonList);
  }
  
}
