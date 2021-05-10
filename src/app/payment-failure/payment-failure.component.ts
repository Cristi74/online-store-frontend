import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.scss']
})
export class PaymentFailureComponent implements OnInit, AfterViewInit {
  darkTheme!: boolean;
  curentTheme!: string;
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  receive(event: any) {
    this.curentTheme = event
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.curentTheme
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    console.log(this.darkTheme, this.curentTheme)
  }
  ngAfterViewInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    this.darkTheme ?
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#3d3c3c"
      : this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fafbfc';
  }
}
