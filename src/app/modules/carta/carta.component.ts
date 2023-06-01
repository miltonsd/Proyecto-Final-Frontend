import { Component, OnInit } from '@angular/core'
import { CartaService } from './services/carta.service'

import { map } from 'rxjs/operators'

@Component({
  selector: 'pa-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent implements OnInit {
  tiposP: any[] = []

  constructor(private _cartaService: CartaService) {}

  ngOnInit(): void {
    this.getAllTiposProducto()
  }

  getAllTiposProducto() {
    this._cartaService
      .getAllTiposProducto()
      .pipe(
        map((res: any) => {
          this.tiposP = Object.keys(res).map((tp) => ({
            id_tipoProducto: res[tp].id_tipoProducto,
            descripcion: res[tp].descripcion,
            imagen: res[tp].imagen
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }
}
