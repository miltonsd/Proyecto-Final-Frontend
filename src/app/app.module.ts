import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

// Angular Material
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { MAT_DATE_LOCALE } from '@angular/material/core'

// Core
import {
  HeaderComponent,
  FooterComponent,
  PageNotFoundComponent
} from '@pa/core/components'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'

const core = [HeaderComponent, FooterComponent, PageNotFoundComponent]
const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [AppComponent, ...core],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ...modules
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
