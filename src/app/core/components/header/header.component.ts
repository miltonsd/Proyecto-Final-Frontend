import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { of, Subscription, switchMap, tap } from 'rxjs'

import { DialogComponent } from '@pa/shared/components/dialog/dialog.component'
import { QrScannerComponent } from '@pa/shared/components/qr-scanner/qr-scanner.component'
import { AuthService } from '@pa/shared/services/auth.service'
import { MesaService } from '@pa/shared/services/mesa.service'

// Se define una interface que contenga los enlaces
export interface IEnlace {
  routerLink: string
  label: string
  icon: string
  roles: number[]
}

@Component({
  selector: 'pa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false // Estado del login del usuario
  private _authSubscription: Subscription = new Subscription()

  enlacesUsuario: IEnlace[] = [
    { routerLink: '/reservas', label: 'Reservar', icon: 'event', roles: [2] },
    {
      routerLink: '/mesas',
      label: 'Gestión de mesas',
      icon: 'table_bar',
      roles: [3]
    },
    {
      routerLink: '/pedidos',
      label: 'Gestión de pedidos',
      icon: 'pending_actions',
      roles: [3, 4]
    },
    {
      routerLink: '/admin',
      label: 'Administrador',
      icon: 'person_apron',
      roles: [1]
    },
    {
      routerLink: '/perfil/info',
      label: 'Mi perfil',
      icon: 'account_circle',
      roles: [1, 2, 3, 4]
    }
  ]

  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private _mesaService: MesaService,
    private _cookieService: CookieService,
    private _router: Router
  ) {}

  ngOnInit() {
    // Suscribe al BehaviourSubject para obtener el actual y futuros estados
    this._authSubscription = this._authService.loggedInStatus.subscribe(
      (status) => {
        this.isLoggedIn = status
      }
    )
  }

  ngOnDestroy() {
    this._authSubscription.unsubscribe()
  }

  // Getter público para usar el rol del usuario en el html
  get usuarioRol() {
    return this._authService.loggedIn() ? this._authService.getRol() : 0
  }

  logout() {
    this._authService
      .logout()
      .pipe(
        // Encadena la llamada para habilitar la mesa
        switchMap(() => {
          // Verifica si existe la cookie
          if (this._cookieService.check('ClienteMesa')) {
            const cookieValue = this._cookieService.get('ClienteMesa')
            const id_mesa = Number(cookieValue.split(':')[1])
            return this._mesaService.habilitarMesa(id_mesa)
          }

          // Si no hay cookie, devuelve un Observable vacío para continuar el flujo
          return of(null)
        }),
        // Limpia los datos locales después de que todo haya terminado
        tap(() => {
          this._cookieService.delete('ClienteMesa', '/')
          this._authService.borrarToken() // Borra el token local y actualiza el estado
        })
      )
      .subscribe({
        next: () => this._router.navigate(['/']),
        error: (err) => {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '375px',
            autoFocus: true,
            data: { title: `Error ${err.status}`, msg: err.error.msg }
          })
          dialogRef.afterClosed().subscribe(() => {
            // Si hay un error, de todas formas se borran los datos locales
            this._finalizarLogout()
          })
        }
      })
  }

  private _finalizarLogout() {
    this._authService.borrarToken()
    this._router.navigate(['/'])
  }

  scanearQR() {
    const dialogRef = this.dialog.open(QrScannerComponent, {})
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado && resultado.data) {
        this._router.navigate(['/carta'])
      }
    })
  }
}
