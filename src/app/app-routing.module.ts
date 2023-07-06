import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageNotFoundComponent } from '@pa/core/components'
import { canMatchAuthGuard } from './shared/guards/auth/can-match-auth.guard'

const routes: Routes = [
  {
    path: '', // La / no se indica
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule)
  },

  {
    path: 'reservas',
    loadChildren: () =>
      import('./modules/reservas/reservas.module').then(
        (m) => m.ReservasModule
      ),
    canMatch: [canMatchAuthGuard]
  },

  {
    path: 'carta',
    loadChildren: () =>
      import('./modules/carta/carta.module').then((m) => m.CartaModule)
  },

  {
    path: 'pedidos',
    loadChildren: () =>
      import('./modules/pedidos/pedidos.module').then((m) => m.PedidosModule),
    canMatch: [canMatchAuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canMatch: [canMatchAuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./modules/usuarios/usuarios.module').then(
        (m) => m.UsuariosModule
      ),
    canMatch: [canMatchAuthGuard]
  },

  // Página 404
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
