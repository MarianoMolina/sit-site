import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  constructor(private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
  }
  
  confirmAction(bool: boolean): void {
    this.save.emit(bool)
    this.dialogRef.close()
  }

}
