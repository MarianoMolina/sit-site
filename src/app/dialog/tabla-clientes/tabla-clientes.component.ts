import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  styleUrls: ['./tabla-clientes.component.css']
})
export class TablaClientesComponent implements OnInit {
  displayedColumns: string[] = ['cliente', 'col1', 'col2', 'col3']
  dataSource: any
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TablaClientesComponent>) { 
    this.dataSource = data
  }

  ngOnInit(): void {
  }

}
