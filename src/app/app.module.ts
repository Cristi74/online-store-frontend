import { UserDetailsComponent } from './user-details/user-details.component';
import { FilterProductPipe } from './pipes/filter-product.pipe';
import { ProductDetailsDialogComponent } from './product/product-details-dialog/product-details-dialog.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductItemComponent } from './product/product-item/product-item.component';
import { MaterialModule } from './../modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingModule } from 'ng-starrating';
import { CartComponent } from './cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './alert/alert.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    ProductItemComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductDetailsDialogComponent,
    FilterProductPipe,
    AlertComponent,
    NavbarComponent,
    UserDetailsComponent,
  ],
  entryComponents: [ProductDetailsDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    HttpClientModule,
    OverlayModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  exports: [NavbarComponent],
})
export class AppModule {}
