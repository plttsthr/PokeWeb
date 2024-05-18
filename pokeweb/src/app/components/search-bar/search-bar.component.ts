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

  onSearchInputChange(): void {
    if (!this.searchQuery.trim()) {
      this.searchQuery = '';
    }
    this.searchService.setQuery(this.searchQuery);
    console.log(this.searchQuery);
  }

  onSubmit(): void {
    this.searchService.setQuery(this.searchQuery);
    console.log(this.searchQuery);
  }
}
