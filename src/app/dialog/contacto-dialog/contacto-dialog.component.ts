import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contacto, new_contacto, UtilsService } from 'app/services/utils.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-contacto-dialog',
  templateUrl: './contacto-dialog.component.html',
  styleUrls: ['./contacto-dialog.component.css']
})
export class ContactoDialogComponent {
  current_contacto: Contacto
  initial_contacto: Contacto
  type: string
  @Output() save = new EventEmitter<[Contacto, string]>()

  constructor(private cDialogRef: MatDialogRef<any>, @Inject (MAT_DIALOG_DATA) private data: {contacto: Contacto, type: string}, private utils: UtilsService, private dialog: MatDialog) {
    this.type = data.type != null ? data.type : 'create'
    this.current_contacto = data.contacto != null ? data.contacto : new_contacto()
    this.initial_contacto = this.current_contacto
   }
  confirmAction() {
    if (this.checks()) {
      this.save.emit([this.current_contacto, 'confirm']) 
      this.cDialogRef.close()
    } else {
      this.dialog.open(ErrorDialogComponent, {data: 'Llene todos los campos para poder guardar los cambios'})
    }
  }
  cancelAction(){
    if (this.type === 'edit') this.save.emit([this.initial_contacto, 'cancel_edit']) 
    else if (this.type === 'create') this.save.emit([new_contacto(), 'cancel_create']) 
  }
  deleteAction(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.componentInstance.save.subscribe((res) => {
      if (res){
        if (this.type === 'edit') this.save.emit([new_contacto(), 'delete']) 
        this.cDialogRef.close()
      }
    })
  }
  checks(): boolean {
    console.log("checking: ", this.current_contacto)
    if (this.current_contacto.Nombre.length === 0) return false
    if (this.current_contacto.area === undefined || isNaN(this.current_contacto.area) || this.current_contacto.area.toString().length === 0) return false
    if (this.current_contacto.cod === undefined || isNaN(this.current_contacto.cod) ||  this.current_contacto.cod.toString().length === 0) return false
    if (this.current_contacto.telefono === undefined || isNaN(this.current_contacto.telefono) ||  this.current_contacto.telefono.toString().length === 0) return false
    this.current_contacto.telefono_completo = parseInt(this.current_contacto.cod.toString() + this.current_contacto.area.toString() + this.current_contacto.telefono.toString())
    return true
  }
}
