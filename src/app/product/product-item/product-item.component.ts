import { Product } from './../../models/product';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnChanges {
  constructor() { }
  @Input() darkTheme!: boolean;
  @Input() product!: Product;

  ngOnInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }
  ngOnChanges(changes: SimpleChanges) {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    changes = JSON.parse(localStorage.getItem('darkTheme')!)
    this.darkTheme = !!changes
  }
}
