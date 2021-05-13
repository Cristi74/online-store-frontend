import { ProductService } from './../../services/product.service';
import { Product } from './../models/product';
import { User } from 'src/app/models/user';
import { CartService } from './../../services/cart.service';
import { OrderService } from './../../services/order.service';
import { Component, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { cartBE } from '../models/cartBE';

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
  address = true;
  transportFee = environment.transportFee;
  darkTheme!: boolean;
  curentTheme!: string;
  outOfStock = false;
  outOfStockMsg!: string;
  haveStock!: boolean;
  productName!: string;


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
    this.prepareOrder(this.cart)
  }

  prepareOrder(obj: cartBE) {
    this.products = [];

    if (Object.keys(obj).length > 0) {
      let productsIds = Object.keys(obj.products);
      productsIds.forEach((element: string) =>
        this.productService.getProduct(element).subscribe((res) => {
          let product = res;
          product.qty = obj.products[res.id];
          if (product.qty != 0) {
            this.products.push(product);
            this.orderValue += product.price * product.qty;
            this.orderObject[product.id] = product.qty;
          }
        })
      );
    }
  }

  placeOrder() {
    let order = Object();
    this.outOfStock = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '{}');
    order['orderDate'] = new Date();
    order['orderValue'] = this.orderValue;
    order['orderedProducts'] = this.cart.products;
    order['userId'] = this.user.id;

    if (this.user.addressEntity.address != '' && this.user.addressEntity.city != '')
      this.orderService.postOrder(order).subscribe(
        (response: Response) => {
          console.log(response);

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
          localStorage.removeItem('cart');
          this.cartService.deleteCart(this.cart.id).subscribe();
          this.cartService.update({});
          this.confirm = true;
          this.outOfStock = false;
        },
        (error) => {
          console.log(error);

          if (error.status == 400) {
            let localCart = JSON.parse(localStorage.getItem('cart') || '{}');
            this.outOfStockMsg = error.error[0];
            this.haveStock = true;
            this.outOfStock = true;
            for (let key in localCart.products) {
              if (localCart.products[key] == 0) {
                delete localCart.products[key];
              }
            }
            localStorage.setItem('cart', JSON.stringify(localCart));
            this.cart = JSON.parse(localStorage.getItem('cart') || '{}');
            this.cartService.update(this.cart);
            this.prepareOrder(this.cart);
          }

          if (error.status == 500 && error.error.substring(0, 15) === "There are only:") {
            let wishedProducts = order.orderedProducts
            let numberPattern = /\d+/g;
            let itemsInStock = parseInt(error.error.match(numberPattern)[0])
            this.orderValue = 0;
            this.outOfStock = true;
            this.outOfStockMsg = error.error;
            Object.entries(wishedProducts).forEach(
              ([key, value]) => {
                this.productService.getProduct(key).subscribe((res) => {
                  if (res.itemsInStock <= itemsInStock) {
                    order.orderedProducts[key] = res.itemsInStock;
                    this.cart.products[key] = res.itemsInStock;
                    if (res.itemsInStock == 0) {
                      delete this.cart.products[key];
                    }
                    this.productName = res.name;
                    localStorage.setItem('cart', JSON.stringify(this.cart));
                    this.cartService.update(this.cart);
                    this.prepareOrder(this.cart);
                    res.itemsInStock != 0 ? this.haveStock = true : this.haveStock = false;
                  }
                })
              }
            );
          }
        }
      );
    else {
      this.address = false;
      this.confirm = true;
      setTimeout(() => {
        this.confirm = false;
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
  noContinue() {
    this.router.navigate(['/cart']);
    this.outOfStock = false;
  }
}
