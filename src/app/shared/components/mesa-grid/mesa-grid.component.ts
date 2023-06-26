import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  Output
} from '@angular/core'
import { IMesa } from '../../models/IMesa'

@Component({
  selector: 'pa-mesa-grid',
  templateUrl: './mesa-grid.component.html',
  styleUrls: ['./mesa-grid.component.css']
})
export class MesaGridComponent implements OnChanges {
  @Input() mesas!: IMesa[] // Lista de mesas de la DB
  @Input() fechaHora!: string // Fecha y hora ingresadas desde el formulario
  @Input() cantidad!: number // Cantidad de personas ingresada desde el formulario
  @Output() mesaSeleccionadaId = new EventEmitter<{ id: number }>()
  @Input() mesaSeleccionada: IMesa | undefined

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta si hubo cambios en los @Input() de fechaHora o cantidad
    if (changes['fechaHora'] || changes['cantidad']) {
      this.deseleccionarMesa()
    }
  }

  reservaMesa(mesa: IMesa) {
    // Si la mesa está disponible y no es la que está seleccionada
    if (mesa.habilitada && this.mesaSeleccionada != mesa) {
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
