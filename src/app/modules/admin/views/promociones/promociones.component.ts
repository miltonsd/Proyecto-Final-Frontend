import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { PromocionesService } from '@pa/admin/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'

@Component({
  selector: 'pa-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

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
            fecha_hasta: moment(res[p].fecha_hasta).format('DD/MM/yyyy')
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Promociones
    this.columnas = [
      { name: 'ID', dataKey: 'id_promocion' },
      { name: 'Porcentaje de descuento', dataKey: 'porcentaje_desc' },
      { name: 'Fecha desde', dataKey: 'fecha_desde' },
      { name: 'Fecha hasta', dataKey: 'fecha_hasta' },
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
}
