import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageNotFoundComponent } from '@pa/core/components'

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule)
  },

  {
    path: 'reservas',
    canLoad: [],
    loadChildren: () =>
      import('./modules/reservas/reservas.module').then((m) => m.ReservasModule)
  },

  {
    path: 'carta',
    canLoad: [],
    loadChildren: () =>
      import('./modules/carta/carta.module').then((m) => m.CartaModule)
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
