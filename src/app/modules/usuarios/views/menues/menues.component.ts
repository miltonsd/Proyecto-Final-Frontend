import { Component, OnInit } from '@angular/core'
import { map } from 'rxjs'
import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'

@Component({
  selector: 'pa-menues',
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.css']
})
export class MenuesComponent implements OnInit {
  menues: any[] = []
  // Defino las columnas de la tabla de histórico de menúes
  columnas: TableColumn[] = [
    { name: 'Título', dataKey: 'titulo' },
    { name: 'Productos', dataKey: 'productos' }
  ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todos los menúes del usuario
    this._usuariosService
      .getAllMenuesUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.menues = Object.keys(res).map((m) => ({
            titulo: res[m].titulo,
            productos: res[m].Productos.map(
              (pr: any) => pr.descripcion + ' ($ ' + pr.precio + ')'
            ).join(' - ')
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }
}
