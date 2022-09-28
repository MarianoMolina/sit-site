import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {
  text: string
  constructor(@Inject(MAT_DIALOG_DATA) public data: {cant: number, type: string}) { 
    if (data.type){
      if (data.type === 'descarga') this.text = `Descarga de contactos (${data.cant}) realizada exitosamente.`
      else if (data.type === 'carga') this.text = `Carga realizada exitosamente. Se han creado ${data.cant} nuevos elementos.`
      else this.text = 'Acción completada con éxito'
    } else {
      this.text = 'Acción completada con éxito'
    }
  }

  ngOnInit(): void {
  }

}
