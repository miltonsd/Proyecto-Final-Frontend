import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { QrScannerComponent } from '@pa/shared/components/qr-scanner/qr-scanner.component'
import { AuthService } from '@pa/shared/services/auth.service'
import { MesaService } from '@pa/shared/services/mesa.service'
import { CookieService } from 'ngx-cookie-service'
import { of, Subscription, switchMap, tap } from 'rxjs'

@Component({
  selector: 'pa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false // Estado del login del usuario
  private _authSubscription: Subscription = new Subscription()

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
    return this._authService.loggedIn() ? this._authService.getRol() : undefined
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
          console.error(`Código de error ${err.status}: `, err.error.msg)
          // Si hay un error, de todas formas se borran los datos locales
          this._finalizarLogout()
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
