import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'

@Component({
  selector: 'pa-h-reservas',
  templateUrl: './h-reservas.component.html',
  styleUrls: ['./h-reservas.component.css']
})
export class HReservasComponent implements OnInit {
  reservas: any[] = []
  // Defino las columnas de la tabla de histórico de reservas
  columnasCelu: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    { name: 'Mesa', dataKey: 'id_mesa' },
    { name: '¿Está pendiente?', dataKey: 'isPendiente' },
    { name: '¿Fue cancelada?', dataKey: 'deletedAt' }
  ]
  columnasPC: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    { name: 'Cantidad de personas', dataKey: 'cant_personas' },
    { name: 'Mesa', dataKey: 'id_mesa' },
    { name: '¿Está pendiente?', dataKey: 'isPendiente' },
    { name: '¿Fue cancelada?', dataKey: 'deletedAt' }
  ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todas las reservas del usuario
    this._usuariosService
      .getAllReservasUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.reservas = Object.keys(res).map((r) => ({
            fechaHora: moment(res[r].fechaHora).format('DD/MM/yyyy HH:mm'),
            isPendiente: res[r].isPendiente ? 'Si' : 'No',
            cant_personas: res[r].cant_personas,
            id_mesa: res[r].id_mesa,
            deletedAt: res[r].deletedAt === null ? 'No' : 'Si'
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }
}
