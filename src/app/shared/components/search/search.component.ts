import { FilterEventService } from './../../../core/services/filter-event/filter-event.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public searchText: string = '';

  constructor(private filterEventService: FilterEventService) {}

  public search() {
    if (this.searchText === '') {
      return;
    }

    if (this.searchText.length < 3) {
      return;
    }

    this.filterEventService.emit(this.searchText);
  }
}
