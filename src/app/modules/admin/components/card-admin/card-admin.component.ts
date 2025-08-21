import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'pa-card-admin',
  templateUrl: './card-admin.component.html',
  styleUrls: ['./card-admin.component.css']
})
export class CardAdminComponent {
  @Input() tablaDB!: any

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate([`/admin/${this.tablaDB.url}`])
  }
}
