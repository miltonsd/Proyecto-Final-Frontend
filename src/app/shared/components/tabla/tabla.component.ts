import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core'

// Angular Material
import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'

// Shared
import { TableButtonAction, TableColumn } from '@pa/shared/models'
import { ConfirmDialogComponent } from '@pa/shared/components'

@Component({
  selector: 'pa-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  displayedColumns: string[] = []
  dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  @Input() isSortable = false
  @Input() isFilter = false
  @Input() isPaginator = false
  @Input() pageOptions!: number[]

  @Input() tableColumns!: TableColumn[]

  @Input() set tableData(data: any[]) {
    // Crea los datos de la tabla
    this.dataSource = new MatTableDataSource(data)
  }

  @Output() action: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>()

  constructor(public dialog: MatDialog) {}

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  openDialog(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { msg: element.name }
    })
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.action.emit(element)
      }
    })
  }
}
