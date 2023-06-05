import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'pa-card-tipo-producto',
  templateUrl: './card-tipo-producto.component.html',
  styleUrls: ['./card-tipo-producto.component.css']
})
export class CardTipoProductoComponent implements OnInit {
  @Input() tipo!: any
  urlTipo!: string

  ngOnInit(): void {
    this.urlTipo = this.tipo.descripcion.replace(/\s/g, '')
  }
}
