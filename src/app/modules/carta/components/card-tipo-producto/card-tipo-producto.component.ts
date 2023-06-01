import { Component, Input } from '@angular/core'

@Component({
  selector: 'pa-card-tipo-producto',
  templateUrl: './card-tipo-producto.component.html',
  styleUrls: ['./card-tipo-producto.component.css']
})
export class CardTipoProductoComponent {
  @Input() tipo!: any
}
