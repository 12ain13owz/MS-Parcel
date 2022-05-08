import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

import { UserComponent } from './user.component';
import {
  NavbarComponent,
  NewProductDialog,
} from './layouts/navbar/navbar.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../material.module';
import { AuthInterceptorProviders } from './shared/auth.interceptor';
import { AuthService } from './shared/auth.service';
import { AuthGuard } from './shared/auth.guard';
import { ScanComponent } from './components/scan/scan.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  EditProductDialog,
  ProductComponent,
} from './components/product/product.component';
import { environment } from 'src/environments/environment';
import { TokenService } from './shared/token.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpService } from './shared/http.service';
import { ProgressBarComponent } from './layouts/progress-bar/progress-bar.component';
import { StockComponent } from './components/stock/stock.component';

export function tokenGetter() {
  return localStorage.getItem('auth-token');
}

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    UserComponent,
    NavbarComponent,
    SidenavComponent,
    DashboardComponent,
    ScanComponent,
    ProductComponent,
    NotFoundComponent,
    NewProductDialog,
    EditProductDialog,
    ProgressBarComponent,
    StockComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: [environment.localhost],
    //     disallowedRoutes: [`${environment.USER_API}login`],
    //   },
    // }),
  ],
  exports: [FormsModule, ReactiveFormsModule],

  providers: [
    AuthInterceptorProviders,
    AuthService,
    TokenService,
    AuthGuard,
    HttpService,
  ],
})
export class UserModule {}
