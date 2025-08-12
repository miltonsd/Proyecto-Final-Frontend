import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { map } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { ConfirmDialogComponent, DialogComponent } from '@pa/shared/components'
import { MatDialog } from '@angular/material/dialog'
import { ResumenPOST } from '../../models/resumenes'
import { PedidoDia } from 'src/app/modules/pedidos/models'
import { ResumenesService } from 'src/app/modules/carta/services/resumenes.service'
import { MesaService } from '@pa/shared/services/mesa.service'

@Component({
  selector: 'pa-pedidos-dia',
  templateUrl: './pedidos-dia.component.html',
  styleUrls: ['./pedidos-dia.component.css']
})
export class PedidosDiaComponent implements OnInit {
  pedidos: PedidoDia[] = []
  resumen!: ResumenPOST //
  estadoPanel = false
  id_usuario = this._authService.getCurrentUserId()

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService,
    private _resumenService: ResumenesService,
    private _cookieService: CookieService,
    private _mesaService: MesaService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPedidosDia()
  }

  getPedidosDia() {
    this._usuariosService
      .getAllPedidosUsuario(this.id_usuario)
      .pipe(
        map((res: any) => {
          this.pedidos = Object.keys(res)
            .map((p) => ({
              id_pedido: res[p].id_pedido,
              fechaHora: res[p].fechaHora,
              subtotal: res[p].montoImporte,
              estado: res[p].estado,
              mesa: res[p].id_mesa,
              id_usuario: this.id_usuario,
              observacion: res[p].observacion,
              id_resumenDiario: res[p].id_resumenDiario,
              productos: res[p].Productos.map((pr: any) => {
                return {
                  id_producto: pr.id_producto,
                  descripcion: pr.descripcion,
                  cant_selecc: pr.PedidoProductos.cantidad_prod,
                  precio: pr.PedidoProductos.precio_unitario
                }
              })
            }))
            .filter(
              (p) =>
                moment(p.fechaHora).isAfter(moment().subtract(12, 'hours')) &&
                p.id_resumenDiario === null
            )
        })
      )
      .subscribe({
        next: () => console.log(this.pedidos),
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  calculaTotal() {
    let monto = 0
    this.pedidos.forEach((p) => {
      monto += p.subtotal
    })
    return monto
  }

  pedirCuenta() {
    // Comprueba que todos los pedidos esten entregados
    const todosEntregados = this.pedidos.every((p) => p.estado === 'Entregado')

    // Si hay un pedido pendiente, no se puede pedir la cuenta
    if (!todosEntregados) {
      // Muestra un mensaje de error si hay pedidos pendientes
      this.dialog.open(DialogComponent, {
        width: '375px',
        autoFocus: true,
        data: {
          title: 'Error al pedir la cuenta',
          msg: 'No se puede pedir la cuenta si hay pedidos pendientes de entrega.'
        }
      })
    } else {
      // Si todos los pedidos estan entregados, se le pregunta al usuario si está seguro de pedir la cuenta
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirmar pedido de cuenta',
          msg: '¿Estás seguro de pedir la cuenta?'
        }
      })
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.crearResumen()
        }
      })
    }
  }

  crearResumen() {
    // Arma el resumen para enviar al backend para guardar en la DB
    this.resumen = {
      fechaHora: new Date(),
      montoTotal: this.calculaTotal(), // Suma todos los subtotales de los pedidos
      id_usuario: this.id_usuario,
      lista_pedidos: this.pedidos
    }

    this._resumenService.createResumen(this.resumen).subscribe({
      next: (res: any) => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '375px',
          autoFocus: true,
          data: { title: 'Pedir la cuenta', msg: res.msg }
        })
        dialogRef.afterClosed().subscribe(() => {
          const cookieValue = this._cookieService.get('ClienteMesa')
          const idMesa = Number(cookieValue.split(':')[1])
          this._mesaService.habilitarMesa(idMesa).subscribe({
            next: () => {
              this._cookieService.delete('ClienteMesa', '/')
            }
          })
          window.location.href = '/'
        })
      },
      error: (err: any) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: { title: `Error ${err.status}`, msg: err.error.msg }
        })
      }
    })
  }
}
