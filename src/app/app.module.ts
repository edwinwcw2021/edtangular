import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BookComponent } from './book/book.component';
import { AboutComponent } from './about/about.component';
import { BorrowComponent } from './controls/borrow.component';
import { LoadingComponent } from './controls/loading.component';
import { ApicallService } from './services/apicall.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BookComponent,
    AboutComponent,
    BorrowComponent,
    LoadingComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    ApicallService, HttpClient, provideHttpClient(), DatePipe,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
