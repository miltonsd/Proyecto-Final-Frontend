import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core'
import { IMesa } from '../../models/IMesa'

@Component({
  selector: 'pa-mesa-grid',
  templateUrl: './mesa-grid.component.html',
  styleUrls: ['./mesa-grid.component.css']
})
export class MesaGridComponent implements DoCheck {
  @Input() mesas: IMesa[] = [] // Lista de mesas de la DB
  @Input() fechaHora!: string // Fecha y hora ingresadas desde el formulario
  @Input() cantidad!: number // Cantidad de personas ingresada desde el formulario
  @Output() mesaSeleccionadaId = new EventEmitter<{ id: number }>()
  mesaSeleccionada: IMesa | undefined
  fechaHoraInit = ''
  cantidadInit = 0

  ngDoCheck(): void {
    // Comprueba si se cambia la fecha, hora y cantidad ingresadas. En caso de modificarlas, desmarca la mesa seleccionada previamente.
    if (
      this.fechaHoraInit !== this.fechaHora ||
      this.cantidadInit !== this.cantidad
    ) {
      // Guarda la fechaHora actual para comparar si hay modificacion
      this.fechaHoraInit = this.fechaHora
      // Guarda la cantidad actual para comparar si hay modificacion
      this.cantidadInit = this.cantidad
      this.deseleccionarMesa()
    }
  }

  reservaMesa(mesa: IMesa) {
    // Si la mesa está disponible y no es la que está seleccionada
    if (mesa.available && this.mesaSeleccionada != mesa) {
      this.mesaSeleccionada = mesa
      // Pasa el id de la mesa al componente Padre (reservas.component.ts)
      this.mesaSeleccionadaId.emit({ id: mesa.id_mesa })
    } else {
      this.deseleccionarMesa()
    }
  }

  deseleccionarMesa() {
    // Deselecciona la mesa y pasa el id = 0
    this.mesaSeleccionada = undefined
    this.mesaSeleccionadaId.emit({ id: 0 })
  }
}
