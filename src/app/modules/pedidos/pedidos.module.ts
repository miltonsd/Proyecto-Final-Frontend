import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pedidos.component';

import { ComponentsModule, MaterialModule  } from '@pa/shared/modules'


@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    ComponentsModule,
    MaterialModule
  ]
})
export class PedidosModule { }
