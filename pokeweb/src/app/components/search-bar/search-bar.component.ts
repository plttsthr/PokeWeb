// Angular core import for component functionality
import { Component } from '@angular/core';
// Custom service for managing search queries
import { SearchService } from '../../services/search-bar.service';

@Component({
  selector: 'app-search-bar', // Defines the HTML tag for this component
  templateUrl: './search-bar.component.html', // Path to the component's template
  styleUrls: ['./search-bar.component.css'] // Path to the component's styles
})
export class SearchBarComponent {
  searchQuery: string = ''; // Variable to store the current search query

  // Constructor to inject the search service
  constructor(private searchService: SearchService) {}

  // Method to handle changes in the search input field
  onSearchInputChange(): void {
    // Trim whitespace from the search query
    if (!this.searchQuery.trim()) {
      this.searchQuery = '';
    }
    // Update the search query in the search service
    this.searchService.setQuery(this.searchQuery);
    console.log(this.searchQuery); // Log the search query for debugging
  }

  // Method to handle form submission
  onSubmit(): void {
    // Update the search query in the search service
    this.searchService.setQuery(this.searchQuery);
    console.log(this.searchQuery); // Log the search query for debugging
  }
}
