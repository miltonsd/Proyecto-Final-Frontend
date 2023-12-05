import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { map } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'

import { ReservaDataDialog } from '@pa/admin/models'
import { ReservasDialogComponent } from '@pa/admin/components'
import { ReservasService } from '@pa/reservas/services'
import { ReservaData, ReservaTabla } from '@pa/reservas/models'
import { DialogComponent } from '@pa/shared/components'
import { TableColumn } from '@pa/shared/models'

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  datosTabla: ReservaTabla[] = []
  columnasPC: TableColumn[] = []
  columnasCelu: TableColumn[] = []

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
            fechaHora: moment(res[r].fechaHora).format('DD/MM/yyyy HH:mm'),
            cant_personas: res[r].cant_personas,
            isPendiente: res[r].isPendiente,
            pendiente: res[r].isPendiente?"Si":"No",
            id_usuario: res[r].Usuario.id_usuario,
            id_mesa: res[r].Mesa.id_mesa,
            usuario: res[r].Usuario.nombre + ' ' + res[r].Usuario.apellido,
            mesa: res[r].Mesa.id_mesa + ' - ' + res[r].Mesa.ubicacion
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Reservas
    this.columnasPC = [
      { name: 'ID', dataKey: 'id_reserva' },
      { name: 'Fecha y hora', dataKey: 'fechaHora' },
      { name: 'Cantidad de personas', dataKey: 'cant_personas' },
      { name: '¿Está pendiente?', dataKey: 'pendiente' },
      { name: 'Usuario', dataKey: 'usuario' },
      { name: 'Mesa', dataKey: 'mesa' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
    this.columnasCelu = [
      { name: 'Fecha y hora', dataKey: 'fechaHora' },
      { name: 'Cantidad de personas', dataKey: 'cant_personas' },
      { name: 'Usuario', dataKey: 'usuario' },
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
          window.location.href = '/admin/reservas'
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

  onEdit(reserva: any) {
    const dataDialog: ReservaDataDialog<ReservaTabla, ReservaData> = {
      editar: true,
      elemento: reserva,
      listaElementos: this.getListaReservas().filter(
        (r) => r.id_reserva != reserva.id_reserva
      )
    }
    const dialogRef = this.dialog.open(ReservasDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._reservaService
          .updateReserva(reserva.id_reserva, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              const dialogRef = this.dialog.open(DialogComponent, {
                width: '375px',
                autoFocus: true,
                data: {
                  title: 'Editar reserva',
                  msg: 'Reserva ' + respuesta.msg.toLowerCase()
                }
              })
              dialogRef.afterClosed().subscribe(() => {
                window.location.href = '/admin/reservas'
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
    })
  }

  onAdd() {
    const dataDialog: ReservaDataDialog<ReservaTabla, ReservaData> = {
      editar: false,
      listaElementos: this.getListaReservas()
    }
    const dialogRef = this.dialog.open(ReservasDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._reservaService.createReserva(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Agregar reserva',
                msg: 'Reserva ' + respuesta.msg.toLowerCase()
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/reservas'
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
    })
  }

  getListaReservas(): ReservaData[] {
    return this.datosTabla.map((r) => {
      return {
        id_reserva: r.id_reserva,
        fechaHora: r.fechaHora,
        id_mesa: r.id_mesa
      }
    })
  }
}
