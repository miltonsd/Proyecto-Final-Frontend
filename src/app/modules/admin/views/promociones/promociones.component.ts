import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { PromocionesService } from '@pa/admin/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { PromocionesDialogComponent } from '../../components/promociones-dialog/promociones-dialog.component'
import { AdminDataDialog } from '../../models/adminDataDialog'
import { PromocionTabla } from './models/promocion'

@Component({
  selector: 'pa-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  datosTabla: any = []
  columnasPC: TableColumn[] = []
  columnasCelu: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación de la promoción',
    msg: '¿Estás seguro de eliminar la promoción? Esta acción no se puede deshacer.'
  }

  constructor(
    private _promocionService: PromocionesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPromociones()
  }

  cargarPromociones() {
    // Obtengo los datos de la tabla Promociones
    this._promocionService
      .getAllPromociones()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((p) => ({
            id_promocion: res[p].id_promocion,
            porcentaje_desc: res[p].porcentaje_desc,
            fecha_desde: moment(res[p].fecha_desde).format('DD/MM/yyyy'),
            fecha_hasta: moment(res[p].fecha_hasta).format('DD/MM/yyyy'),
            lista_productos: res[p].Productos,
            productos: res[p].Productos.map((pr: any) => pr.descripcion).join(
              ' - '
            )
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Promociones
    this.columnasPC = [
      { name: 'ID', dataKey: 'id_promocion' },
      { name: 'Descuento', dataKey: 'porcentaje_desc' },
      { name: 'Fecha desde', dataKey: 'fecha_desde' },
      { name: 'Fecha hasta', dataKey: 'fecha_hasta' },
      { name: 'Productos', dataKey: 'productos' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
    this.columnasCelu = [
      { name: 'Descuento', dataKey: 'porcentaje_desc' },
      { name: 'Fecha hasta', dataKey: 'fecha_hasta' },
      { name: 'Productos', dataKey: 'productos' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(promocion: any) {
    this._promocionService.deletePromocion(promocion.id_promocion).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar promoción',
            msg: 'Se ha eliminado la promoción con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/promociones'
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

  onEdit(promocion: any) {
    const dataDialog: AdminDataDialog<PromocionTabla> = {
      editar: true,
      elemento: promocion
    }
    const dialogRef = this.dialog.open(PromocionesDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._promocionService
          .updatePromocion(promocion.id_promocion, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              alert(respuesta.msg)
              window.location.href = '/admin/promociones'
            },
            error: (err) => {
              alert(err.msg)
            }
          })
      }
    })
  }

  onAdd() {
    const dataDialog: AdminDataDialog<PromocionTabla> = {
      editar: false
    }
    const dialogRef = this.dialog.open(PromocionesDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      console.log(resultado)
      if (resultado) {
        this._promocionService.createPromocion(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/promociones'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }
}
