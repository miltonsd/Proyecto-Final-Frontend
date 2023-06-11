import { Component, OnInit } from '@angular/core'
import { CartaService } from './services/carta.service'
import { trigger, transition, animate, style } from '@angular/animations'

import { map } from 'rxjs/operators'

@Component({
  selector: 'pa-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateY(-150%)', opacity: '0%' }),
        animate(
          '0.5s 500ms ease-in-out',
          style({ transform: 'translateY(0%)', opacity: '100%' })
        )
      ]),
      transition(':leave', [
        animate(
          '0.5s 500ms ease-in-out',
          style({ transform: 'translateY(-150%)', opacity: '0%' })
        )
      ])
    ])
  ]
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
