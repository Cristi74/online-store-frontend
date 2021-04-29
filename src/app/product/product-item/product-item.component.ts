import { Product } from './../../models/product';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit, OnChanges {
  constructor() { }
  @Input() darkTheme!: boolean;
  @Input() product!: Product;

  ngOnInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }
  ngOnChanges(changes: SimpleChanges) {
    changes = JSON.parse(localStorage.getItem('darkTheme')!)
    this.darkTheme = !!changes
  }
}
