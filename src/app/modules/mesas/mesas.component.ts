import { Component, OnInit } from '@angular/core'
import { MesasService } from './services'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'

@Component({
  selector: 'pa-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  datosMesas: any[] = []
  columnas: TableColumn[] = []

  constructor(private _mesaService: MesasService) {}

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
        next: (respuesta: any) => {
          this.cargarMesas()
          alert(respuesta.msg)
        },
        error: (err) => {
          console.error(`Código de error ${err.status}: `, err.error.msg)
          alert(err.msg)
        }
      })
    } else {
      this._mesaService.habilitarMesa(mesa.id_mesa).subscribe({
        next: (respuesta: any) => {
          this.cargarMesas()
          alert(respuesta.msg)
        },
        error: (err) => {
          console.error(`Código de error ${err.status}: `, err.error.msg)
          alert(err.msg)
        }
      })
    }
  }
}
