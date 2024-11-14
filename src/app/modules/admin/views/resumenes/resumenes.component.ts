import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import * as moment from 'moment'
import { map } from 'rxjs'
import { ResumenesService } from 'src/app/modules/carta/services/resumenes.service'

@Component({
  selector: 'pa-resumenes',
  templateUrl: './resumenes.component.html',
  styleUrls: ['./resumenes.component.css']
})
export class ResumenesComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

  constructor(private _resumenService: ResumenesService) {}

  ngOnInit(): void {
    this.cargarResumenes()
  }

  cargarResumenes() {
    // Obtengo los datos de la tabla Resumenes
    this._resumenService
      .getAllResumenes()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((r) => ({
            id_resumenDiario: res[r].id_resumenDiario,
            fechaHora: moment(res[r].fechaHora).format('DD/MM/yyyy HH:mm'),
            montoTotal: res[r].montoTotal,
            usuario: res[r].Usuario.nombre + ' ' + res[r].Usuario.apellido,
            pedidos: res[r].Pedidos.map((pedido: any) =>
              pedido.id_pedido.toString()
            ).join(' - ')
          }))
        })
      )
      .subscribe({
        next: () => console.log(this.datosTabla),
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Usuarios
    this.columnas = [
      { name: 'Nro.', dataKey: 'id_resumenDiario' },
      { name: 'Fecha y Hora', dataKey: 'fechaHora' },
      { name: 'Monto total', dataKey: 'montoTotal', isCurrency: true },
      { name: 'Usuario', dataKey: 'usuario' },
      { name: 'Nros. Pedido', dataKey: 'pedidos' }
    ]
  }
}
