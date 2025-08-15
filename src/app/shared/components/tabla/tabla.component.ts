import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons'

import { ConfirmDialogComponent } from '@pa/shared/components/confirm-dialog/confirm-dialog.component'
import { TableButtonAction } from '@pa/shared/interfaces/tabla/table-button-action.interface'
import { TableColumn } from '@pa/shared/interfaces/tabla/table-column.interface'
import { AuthService } from '@pa/shared/services/auth.service'

@Component({
  selector: 'pa-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent<T> implements OnInit {
  @Input() isSortable = false
  @Input() isPaginator = false
  @Input() pageOptions!: number[]
  @Input() tableColumns!: TableColumn[]
  @Input() confirmDialogMsg!: any
  @Input() set tableData(data: T[]) {
    // Crea los datos de la tabla
    this.dataSource = new MatTableDataSource(data)
  }

  // Usa el tipo genérico T para emitir el elemento seleccionado
  @Output() deleteAction = new EventEmitter<T>()
  @Output() editAction = new EventEmitter<T>()
  // Add Action es cuando presionas el boton '+1' en la tabla de la Carta
  @Output() addAction: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>()
  // Remove Action es cuando presionas el boton '-1' en la tabla de la Carta
  @Output() removeAction: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>()
  // Menu Action es cuando presionas el boton 'Elegir' en la tabla de menús del Perfil para hacer un pedido
  @Output() menuAction: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>()
  // Details Action es cuando presionas en el nombre de un producto en la tabla de la Carta para ver sus detalles, su foto abriendo el dialog del producto
  @Output() detailsAction: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>()

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  usuarioLogueado = this._authService.loggedIn()
  faArrowPointer = faArrowPointer
  displayedColumns: string[] = []
  dataSource!: MatTableDataSource<any>

  constructor(public dialog: MatDialog, private _authService: AuthService) {}

  ngOnInit(): void {
    const columnNames = this.tableColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    )
    this.displayedColumns = columnNames
  }

  ngAfterViewInit(): void {
    // Agregar paginación a la tabla
    this.dataSource.paginator = this.paginator
    // Agregar sorting a la tabla
    this.dataSource.sort = this.sort
  }

  onDelete(element: T) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: this.confirmDialogMsg
    })
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteAction.emit(element)
      }
    })
  }

  onEdit(element: T) {
    this.editAction.emit(element)
  }

  onAddCart(element: any) {
    this.addAction.emit(element)
  }

  onRemoveCart(element: any) {
    this.removeAction.emit(element)
  }

  onCargarMenu(element: any) {
    this.menuAction.emit(element)
  }

  onVerDetalles(element: any) {
    this.detailsAction.emit(element)
  }
}
