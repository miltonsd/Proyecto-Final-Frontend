import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-categorias-dialog',
  templateUrl: './categorias-dialog.component.html',
  styleUrls: ['./categorias-dialog.component.css']
})
export class CategoriasDialogComponent implements OnInit {
  categoria!: any

  constructor(
    public dialogRef: MatDialogRef<CategoriasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    console.log(this.data)
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.categoria = {
        descripcion: this.formulario.value.descripcion
      }
      this.dialogRef.close({ data: this.categoria })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
