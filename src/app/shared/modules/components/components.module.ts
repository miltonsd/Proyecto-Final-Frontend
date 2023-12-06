import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

// Shared
import {
  TablaComponent,
  DialogComponent,
  ConfirmDialogComponent
} from '@pa/shared/components'
import { MaterialModule } from '@pa/shared/modules'
import { MesaGridComponent } from '../../components/mesa-grid/mesa-grid.component'
import { QrScannerComponent } from '../../components/qr-scanner/qr-scanner.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

const components = [
  TablaComponent,
  DialogComponent,
  ConfirmDialogComponent,
  MesaGridComponent,
  QrScannerComponent
]

@NgModule({
  declarations: [...components],
  imports: [CommonModule, RouterModule, MaterialModule, FontAwesomeModule],
  exports: [...components]
})
export class ComponentsModule {}
