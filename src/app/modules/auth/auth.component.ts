import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'

import { DialogComponent } from '@pa/shared/components/dialog/dialog.component'

@Component({
  selector: 'pa-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authOption: number

  constructor(public dialog: MatDialog, private _route: ActivatedRoute) {
    this.authOption = 1 // Por defecto 1: Login / 2: Register / 3: Reset Password
  }

  ngOnInit() {
    this._route.queryParams.subscribe((params) => {
      // Lee el parámetro de confirmación del usuario
      const confirmed = params['confirmed']

      // Lee el parámetro de cambio de contraseña
      const passwordChanged = params['password_changed']

      // Si se confirmó exitosamente al usuario
      if (confirmed === 'true') {
        this.authOption = 1
        this._showDialog(
          '¡Éxito! 🎉',
          '¡Tu cuenta ha sido confirmada con éxito! Ya puedes iniciar sesión.'
        )
        // Si falló la confirmación del usuario
      } else if (confirmed === 'false') {
        this.authOption = 1
        this._showDialog(
          'Error',
          'Hubo un problema al confirmar tu cuenta. Por favor, intenta de nuevo.'
        )
        // Si se reinició exitosamente la contraseña del usuario
      } else if (passwordChanged === 'true') {
        this.authOption = 1
        this._showDialog(
          '¡Contraseña Cambiada! 🔒',
          'Tu contraseña se ha actualizado correctamente.'
        )
        // Si falló el reinicio de la contraseña del usuario
      } else if (passwordChanged === 'false') {
        this.authOption = 1
        this._showDialog('Error', 'Hubo un error al cambiar la contraseña.')
      }
    })
  }

  changeAuthOption(option: number) {
    this.authOption = option
  }

  // Muestra un dialog, ya sea por error, o para hacer la lógica luego del afterClosed()
  private _showDialog(
    title: string,
    msg: string
  ): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      width: '375px',
      autoFocus: true,
      data: { title, msg }
    })
  }
}
