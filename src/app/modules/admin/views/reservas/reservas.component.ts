import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { ReservasService } from '@pa/reservas/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación de la reserva',
    msg: '¿Estás seguro de eliminar la reserva? Esta acción no se puede deshacer.'
  }

  constructor(
    private _reservaService: ReservasService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarReservas()
  }

  cargarReservas() {
    // Obtengo los datos de la tabla Reservas
    this._reservaService
      .getAllReservas()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((r) => ({
            id_reserva: res[r].id_reserva,
            fechaHora: moment(res[r].fechaNacimiento).format(
              'DD/MM/yyyy HH:mm'
            ),
            cant_personas: res[r].cant_personas,
            isPendiente: res[r].isPendiente,
            usuario: res[r].Usuario.nombre + ' ' + res[r].Usuario.apellido,
            mesa: res[r].Mesa.id_mesa + ' - ' + res[r].Mesa.ubicacion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Reservas
    this.columnas = [
      { name: 'ID', dataKey: 'id_reserva' },
      { name: 'Fecha y hora', dataKey: 'fechaHora' },
      { name: 'Cantidad de personas', dataKey: 'cant_personas' },
      { name: '¿Está pendiente?', dataKey: 'isPendiente' },
      { name: 'Usuario', dataKey: 'usuario' },
      { name: 'Mesa', dataKey: 'mesa' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(reserva: any) {
    this._reservaService.deleteReserva(reserva.id_reserva).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar reserva',
            msg: 'Se ha eliminado la reserva con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/reserva'
        })
      },
      error: (err) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Error',
            msg: err.error.msg
          }
        })
      }
    })
  }
}
