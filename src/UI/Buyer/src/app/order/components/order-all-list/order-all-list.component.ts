import { Component, Input, EventEmitter, Output, OnInit, AfterViewInit } from '@angular/core';
import { ListOrder, OcMeService, OcOrderService } from '@ordercloud/angular-sdk';
import { OrderListColumn } from '@app-buyer/order/models/order-list-column';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OrderStatus } from '@app-buyer/order/models/order-status.model';
import { flatMap } from 'rxjs/operators';
import { MeOrderListOptions } from '@app-buyer/order/models/me-order-list-options';

@Component({
  selector: 'app-order-all-list',
  templateUrl: './order-all-list.component.html',
  styleUrls: ['./order-all-list.component.scss']
})
export class OrderAllListComponent implements OnInit {
  @Input() orders: ListOrder;
  @Input() columns: OrderListColumn[];
  @Input() sortBy: string;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  @Output() updatedSort = new EventEmitter<string>();
  @Output() changedPage = new EventEmitter<number>();

  columnNames: string[] = [];

  constructor(
    public favoriteOrderService: FavoriteOrdersService // used in template
  ) {}

  ngOnInit() {
    this.columnNames = Object.values(this.columns);
    console.log(this.orders)
  }

  public updateSort(selectedSortBy) {
    let sortBy;
    switch (this.sortBy) {
      case selectedSortBy:
        sortBy = `!${selectedSortBy}`;
        break;
      case `!${selectedSortBy}`:
        // setting to undefined so sdk ignores parameter
        sortBy = undefined;
        break;
      default:
        sortBy = selectedSortBy;
    }
    this.updatedSort.emit(sortBy);
  }

  public changePage(page: number): void {
    this.changedPage.emit(page);
  }
 
  
}
