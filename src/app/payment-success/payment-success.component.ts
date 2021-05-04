import { CartService } from './../../services/cart.service';
import { ProductService } from 'src/services/product.service';
import { OrderService } from 'src/services/order.service';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit, AfterViewInit {
  cart!: any;
  success= 0;
  itemsProcessed=0;
  darkTheme!: boolean;
  curentTheme!: string;
  constructor(
    private elementRef: ElementRef,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}
 
  ngOnInit(): void {
    this.cart = JSON.parse(localStorage.getItem('cart') || '{}');
    let order = Object();
    let orderValue = 0;

    order['orderDate'] = new Date();
    order['orderedProducts'] = this.cart.products;
    order['userId'] = this.cart.userId;
    if (Object.keys(this.cart).length > 0) {
      let productsIds = Object.keys(this.cart.products);
      productsIds.forEach((element: string) =>
        this.productService.getProduct(element)
        .subscribe((res) => {
          orderValue += res.price * this.cart.products[res.id];
          order['orderValue'] = orderValue;
          this.itemsProcessed++
        },
        (err:any)=>console.log(err),
        ()=>{
          if(this.itemsProcessed=== productsIds.length) {
            this.orderService.postOrder(order).subscribe(
              (response: Response) => {
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 3000);
                localStorage.removeItem('cart');
                this.cartService.deleteCart(this.cart.id).subscribe();
                this.cartService.update({});
                this.success=1;
              },
              (error) => {
                console.error(error);
                this.success=2;
              }
            );
          }
        }),
      );
    }
  }
  receive(event: any) {
    this.curentTheme = event
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.curentTheme
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }
  ngAfterViewInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    this.darkTheme ?
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#3d3c3c"
      : this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fafbfc';
  }
}
