import { Component, Output, Input, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { LineItem, BuyerProduct } from '@ordercloud/angular-sdk';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '@app-buyer/shared/services/cart/cart.service';

@Component({
  selector: 'shared-line-item-card',
  templateUrl: './line-item-card.component.html',
  styleUrls: ['./line-item-card.component.scss'],
})
export class LineItemCardComponent implements OnInit {
  closeIcon = faTimes;
  maxLimitReached = false;
  @Input() lineitem: LineItem;
  @Input() productDetails: BuyerProduct;
  @Input() readOnly: boolean;
  @Output() deletedLineItem = new EventEmitter<LineItem>();
  @Output() lineItemUpdated = new EventEmitter<LineItem>();

  constructor(
    public cartService: CartService // used in template
  ) {

  }
  ngOnInit(): void {
    // console.log(this.productDetails.xp.MaxQuantityLimit)
    // console.log(this.lineitem.Quantity)
    this.validMaxLimit(this.productDetails.xp.MaxQuantityLimit, this.lineitem.Quantity)
  }

  public deleteLineItem() {
    this.deletedLineItem.emit(this.lineitem);
  }

  updateQuantity(qty: number) {
    this.lineitem.Quantity = qty;
    this.lineItemUpdated.emit(this.lineitem);
  }

  validMaxLimit(maxQuant, quant) {
    if (maxQuant < quant) {
      this.maxLimitReached = true
      // console.log(this.maxLimitReached)
    }
    else {
      this.maxLimitReached = false
    }
  }
}
