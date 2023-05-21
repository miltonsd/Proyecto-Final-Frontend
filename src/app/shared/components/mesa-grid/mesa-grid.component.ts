import { Component, Input, OnInit } from '@angular/core'
import { IMesa } from '../../models/IMesa'

@Component({
  selector: 'pa-mesa-grid',
  templateUrl: './mesa-grid.component.html',
  styleUrls: ['./mesa-grid.component.css']
})
export class MesaGridComponent implements OnInit {
  @Input() mesas: IMesa[] = []

  mesaSeleccionada: IMesa | undefined

  ngOnInit(): void {
    throw new Error('Method not implemented.')
  }
  reservaMesa(mesa: IMesa) {
    if (mesa.available) {
      this.mesaSeleccionada = mesa
      // Implement the reservation logic here
      console.log('Reserved table:', mesa.id)
    }
  }
}
