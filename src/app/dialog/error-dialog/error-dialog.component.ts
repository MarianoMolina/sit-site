import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {
  text: string
  constructor(@Inject (MAT_DIALOG_DATA) private data: string) { 
    this.text = data
  }

  ngOnInit(): void {
  }

}
