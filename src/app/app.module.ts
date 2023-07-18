import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module' // Importando el app-routing, ya conoce los modulos creados
import { AppComponent } from './app.component'

// Angular Material
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'

// Font-Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

// Core
import {
  HeaderComponent,
  FooterComponent,
  PageNotFoundComponent
} from '@pa/core/components'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'
import { TokenInterceptorService } from './shared/services/token-interceptor.service'

import { CookieService } from 'ngx-cookie-service'

const core = [HeaderComponent, FooterComponent, PageNotFoundComponent]
const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [AppComponent, ...core],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    ...modules
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: ['l', 'LL'] },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { disableClose: true } },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
