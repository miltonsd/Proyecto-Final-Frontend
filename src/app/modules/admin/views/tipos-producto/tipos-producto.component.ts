import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { CartaService } from '@pa/carta/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { TiposProductoDialogComponent } from '../../components/tipos-producto-dialog/tipos-producto-dialog.component'

@Component({
  selector: 'pa-tipos-producto',
  templateUrl: './tipos-producto.component.html',
  styleUrls: ['./tipos-producto.component.css']
})
export class TiposProductoComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación del tipo producto',
    msg: '¿Estás seguro de eliminar el tipo producto? Esta acción no se puede deshacer.'
  }

  constructor(private _cartaService: CartaService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarTiposProducto()
  }

  cargarTiposProducto() {
    // Obtengo los datos de la tabla tipos_productos
    this._cartaService
      .getAllTiposProducto()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((tp) => ({
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
    // Defino las columnas de la tabla tipos_productos
    this.columnas = [
      { name: 'ID', dataKey: 'id_tipoProducto' },
      { name: 'Descripcion', dataKey: 'descripcion' },
      { name: 'Imagen', dataKey: 'imagen', isImage: true },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(tipoProducto: any) {
    this._cartaService
      .deleteTipoProducto(tipoProducto.id_tipoProducto)
      .subscribe({
        next: () => {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '300 px',
            data: {
              title: 'Eliminar tipo producto',
              msg: 'Se ha eliminado el tipo producto con éxito.'
            }
          })
          dialogRef.afterClosed().subscribe(() => {
            window.location.href = '/admin/tipo-producto'
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

  onEdit(tipoProducto: any) {
    const dialogRef = this.dialog.open(TiposProductoDialogComponent, {
      width: '900px',
      data: {
        tipoProducto,
        accion: 'editar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._cartaService
          .updateTipoProducto(tipoProducto.id_tipoProducto, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              alert(respuesta.msg)
              window.location.href = '/admin/tipos-producto'
            },
            error: (err) => {
              alert(err.msg)
            }
          })
      }
    })
  }

  onAdd() {
    const dialogRef = this.dialog.open(TiposProductoDialogComponent, {
      width: '900px',
      data: {
        accion: 'agregar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._cartaService.createTipoProducto(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/tipos-producto'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }
}
