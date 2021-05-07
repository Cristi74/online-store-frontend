import { UserDetailsComponent } from './user-details/user-details.component';
import { FilterProductPipe } from './pipes/filter-product.pipe';
import { AppInterceptorInterceptor } from './interceptors/app-interceptor.interceptor';
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
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrderComponent } from './order/order.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { MyOrdersComponent } from './user-details/my-orders/my-orders.component';
import { OrderItemComponent } from './user-details/order-item/order-item.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { LanguageInterceptor } from './interceptors/language-interceptor';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { AccountModule } from './account/account.module';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { MatButtonModule } from '@angular/material/button';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    ProductItemComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductDetailsDialogComponent,
    FilterProductPipe,
    OrderComponent,
    UserDetailsComponent,
    ConfirmAccountComponent,
    MyOrdersComponent,
    OrderItemComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    NavbarComponent
  ],
  entryComponents: [ProductDetailsDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    SocialLoginModule,
    MatButtonModule,
    [HttpClientModule],
    OverlayModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '478324556921-usrt6dcims5d9pn6foqpp5rfe9ose3re.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('192048276070498')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  exports: [NavbarComponent, TranslateModule, AccountModule],
})
export class AppModule { }
