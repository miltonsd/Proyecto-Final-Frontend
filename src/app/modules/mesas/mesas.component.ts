import { Component, OnInit } from '@angular/core'
import { MesasService } from './services'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { DialogComponent } from '@pa/shared/components'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'pa-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  datosMesas: any[] = []
  columnas: TableColumn[] = []

  constructor(private _mesaService: MesasService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarMesas()
  }

  cargarMesas() {
    this._mesaService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.datosMesas = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            ubicacion: res[m].ubicacion,
            capacidad: res[m].capacidad,
            habilitada: res[m].habilitada
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  //Método para habilitar o deshabilitar una mesa
  cambiarEstado(mesa: any) {
    if (mesa.habilitada) {
      this._mesaService.deshabilitarMesa(mesa.id_mesa).subscribe({
        next: () => {
          this.cargarMesas()
        },
        error: (err) => {
          // Error 500 cuando no encuentra la tabla 'mesas' o la db, Error 404 cuando no encuentra la mesa por su id
          //  Se pone estas comillas ` ` para mostrar el valor de la variable ${err.status} como string
          this.dialog.open(DialogComponent, {
            width: '375px',
            autoFocus: true,
            data: { title: `Error ${err.status}`, msg: err.error.msg }
          })
        }
      })
    } else {
      this._mesaService.habilitarMesa(mesa.id_mesa).subscribe({
        next: () => {
          this.cargarMesas()
        },
        error: (err) => {
          // Error 500 cuando no encuentra la tabla 'mesas' o la db, Error 404 cuando no encuentra la mesa por su id
          this.dialog.open(DialogComponent, {
            width: '375px',
            autoFocus: true,
            data: { title: `Error ${err.status}`, msg: err.error.msg }
          })
        }
      })
    }
  }
}
