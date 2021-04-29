import { ProductService } from 'src/services/product.service';
import { Product } from './../../models/product';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit {
  @Input() order: any;
  @Output() sectionEvent = new EventEmitter();
  products: Product[] = [];
  constructor(private productService: ProductService) { }
  ids!: string[];
  darkTheme!: boolean;

  changeSection3() {
    this.sectionEvent.emit(3);
  }

  ngOnInit(): void {
    this.ids = Object.keys(this.order.orderedProducts);
    this.ids.forEach(val => {
      this.productService.getProduct(val).subscribe(
        (product: Product) => {
          product.qty = this.order.orderedProducts[val];
          this.products.push(product);
        }
      )
    });
    console.log('oder in child or:', this.order);
    console.log('keys:', this.ids, 'products', this.products);
  }

}
