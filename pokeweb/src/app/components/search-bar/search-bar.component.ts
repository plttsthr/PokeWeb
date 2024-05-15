import { Component } from '@angular/core';
import { SearchService } from '../../services/search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchQuery: string = '';

  constructor(private searchService: SearchService) {}

  onSubmit(): void {

    this.searchService.setQuery(this.searchQuery);
  }
}
