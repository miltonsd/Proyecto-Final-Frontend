import { Component, Input } from '@angular/core'

@Component({
  selector: 'pa-card-admin',
  templateUrl: './card-admin.component.html',
  styleUrls: ['./card-admin.component.css']
})
export class CardAdminComponent {
  @Input() tablaDB!: any
}
