import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { map } from 'rxjs'
import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'
import { PedidoDia } from 'src/app/modules/pedidos/models'

interface Productos {
  id_producto: number
  precio: number
  cant_selecc: number
  descripcion: string
}
@Component({
  selector: 'pa-h-resumenes',
  templateUrl: './h-resumenes.component.html',
  styleUrls: ['./h-resumenes.component.css'],
})
export class HResumenesComponent implements OnInit {
  resumenes: any[] = []
  pedidos: PedidoDia[] = []

  // Defino las columnas de la tabla de histórico de resumenes
  columnas: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    { name: 'Productos', dataKey: 'productos' },
    { name: 'Monto total', dataKey: 'montoTotal', isCurrency: true },
  ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService
  ) {}


  ngOnInit(): void { 
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todos los resumenes del usuario
    this._usuariosService
      .getAllResumenesUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.resumenes = Object.keys(res)
            .map((r) => ({
              fechaHora: moment(res[r].fechaHora).format('DD/MM/yyyy HH:mm'),
              montoTotal: res[r].montoTotal,
              // productos: res[r].Pedido.Productos.map(
              //   (pr: any) =>
              //     pr.descripcion + ' (' + pr.PedidoProductos.cantidad_prod + ')'
              // ).join(' - ')
            }))
        })
      )
      .subscribe({
        next: () => console.log(this.resumenes),
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  // agruparProductos() {
  //   const listaAuxiliar: Productos[] = []
  //   const listaResultado: Productos[] = []

  //   // Guarda los productos de cada pedido en un solo array
  //   this.pedidos.forEach((p) => {
  //     listaAuxiliar.push(...p.productos)
  //   })

  //   // Agrupa los productos guardados anteriormente según su id_producto
  //   listaAuxiliar.forEach((producto) => {
  //     // Busca en otro array si el producto de la lista ya existe
  //     const prod = listaResultado.find(
  //       (p) => p.id_producto === producto.id_producto
  //     )

  //     if (prod) {
  //       // Si existe, suma las cantidades de los pedidos
  //       prod.cant_selecc += producto.cant_selecc
  //     } else {
  //       // Si no existe, guarda el producto en la otra lista
  //       listaResultado.push({ ...producto })
  //     }
  //   })
  //   return listaResultado
  // } 
}