import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@pa/core/components';

const routes: Routes = [
  {path: '', 
   loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) 
  },

  
  // Página 404
  {path: '**',
   component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
