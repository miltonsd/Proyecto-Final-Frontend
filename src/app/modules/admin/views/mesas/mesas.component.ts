import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { MesasService } from '@pa/mesas/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { MesasDialogComponent } from '../../components/mesas-dialog/mesas-dialog.component'

@Component({
  selector: 'pa-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación de la mesa',
    msg: '¿Estás seguro de eliminar la mesa? Esta acción no se puede deshacer.'
  }

  constructor(private _mesaService: MesasService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarMesas()
  }

  cargarMesas() {
    // Obtengo los datos de la tabla mesas
    this._mesaService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            capacidad: res[m].capacidad,
            ubicacion: res[m].ubicacion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla mesas
    this.columnas = [
      { name: 'ID', dataKey: 'id_mesa' },
      { name: 'Capacidad', dataKey: 'capacidad' },
      { name: 'Ubicacion', dataKey: 'ubicacion' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(mesa: any) {
    this._mesaService.deleteMesa(mesa.id_mesa).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar mesa',
            msg: 'Se ha eliminado la mesa con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/mesas'
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

  onEdit(mesa: any) {
    const dialogRef = this.dialog.open(MesasDialogComponent, {
      width: '900px',
      data: {
        mesa,
        accion: 'editar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._mesaService.updateMesa(mesa.id_mesa, resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/mesas'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }

  onAdd() {
    const dialogRef = this.dialog.open(MesasDialogComponent, {
      width: '900px',
      data: {
        accion: 'agregar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._mesaService.createMesa(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/mesas'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }
}
