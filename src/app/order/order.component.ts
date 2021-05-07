import { ProductService } from './../../services/product.service';
import { Product } from './../models/product';
import { User } from 'src/app/models/user';
import { CartService } from './../../services/cart.service';
import { OrderService } from './../../services/order.service';
import { Component, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, AfterViewInit {
  user!: User;
  products: Product[] = [];
  cart!: any;
  orderValue = 0;
  orderObject = Object();
  currencies = ['EUR', 'USD', 'RON']
  pay = Object();
  payCurrency = 'EUR';
  payPrice = 564;
  paypalLogin = Object();
  isHidden = false;
  section = 1;
  confirm = false;
  address=true;
  transportFee = environment.transportFee;
  darkTheme!: boolean;
  curentTheme!: string;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private elementRef: ElementRef,
    private cartService: CartService,
    private productService: ProductService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cart = JSON.parse(localStorage.getItem('cart') || '{}');
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    if (Object.keys(this.cart).length > 0) {
      let productsIds = Object.keys(this.cart.products);
      productsIds.forEach((element: string) =>
        this.productService.getProduct(element).subscribe((res) => {
          let product = res;
          product.qty = this.cart.products[res.id];
          this.products.push(product);
          this.orderValue += product.price * product.qty;
          this.orderObject[product.id] = product.qty;
        })
      );
    }
    this.orderValue = parseFloat(this.orderValue.toFixed(2));
  }
  placeOrder() {
    let order = Object();
    order['orderDate'] = new Date();
    order['orderValue'] = this.orderValue;
    order['orderedProducts'] = this.orderObject;
    order['userId'] = this.user.id;
    if(this.user.addressEntity.address!='' && this.user.addressEntity.city!='') 
      this.orderService.postOrder(order).subscribe(
        (response: Response) => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
          localStorage.removeItem('cart');
          this.cartService.deleteCart(this.cart.id).subscribe();
          this.cartService.update({});
          this.confirm=true;
        },
        (error) => {
          console.error(error);
        }
      );
    else {
      this.address=false;
      this.confirm=true;
      setTimeout(() => {
        this.confirm=false;
        this.router.navigate(['/account/details'])
      }, 3000);
    }
  }
  payPall() {
    let pay = Object();
    pay['currency'] = this.payCurrency;
    pay['price'] = this.orderValue;
    this.orderService.postPayPal(pay).subscribe(
      (response: Response) => {
        this.paypalLogin = response;
        window.location.href = this.paypalLogin.link;
      },
      (error) => {
        console.error(error);
      }
    )
  }
  ngAfterViewInit() {
    this.darkTheme ?
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#3d3c3c"
      : this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fafbfc';
  }
  changeSection(sect: any, event: any) {
    this.section = sect;
    event.stopPropagation();
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }
  hidePaypal(currency: string) {
    currency === "RON" ? this.isHidden = true : this.isHidden = false;
    this.payCurrency = currency;
  }
  receive(event: any) {
    this.curentTheme = event
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.curentTheme
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    console.log(this.darkTheme, this.curentTheme)
  }
}
