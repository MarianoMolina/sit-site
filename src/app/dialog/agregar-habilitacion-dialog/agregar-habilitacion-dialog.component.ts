import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudService } from 'app/services/crud-service.service';
import { FileUpload, Habilitaciones, new_file, new_habilitacion, TIPOS_VEHICULO, UtilsService } from 'app/services/utils.service';
import { finalize, Observable } from 'rxjs';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-agregar-habilitacion-dialog',
  templateUrl: './agregar-habilitacion-dialog.component.html',
  styleUrls: ['./agregar-habilitacion-dialog.component.css']
})
export class AgregarHabilitacionDialogComponent {
  key: string
  habilitaciones: Habilitaciones
  type: string
  headers: string[]
  current_habilitacion: any
  tipos_vehiculo = TIPOS_VEHICULO
  file_upload: FileUpload = new_file()
  file: File | any = null; // Variable to store file

  @Output() save = new EventEmitter<Habilitaciones>()

  constructor(private dialogRef: MatDialogRef<any>, private utils: UtilsService, private crud: CrudService, private dialog: MatDialog,
    @Inject (MAT_DIALOG_DATA) data: {Habilitaciones: Habilitaciones, key: string, type: string}) { 
    this.key = data.key
    this.habilitaciones = data.Habilitaciones === undefined ? new_habilitacion() : data.Habilitaciones
    this.type = data.type === undefined ? '' : data.type
    console.log(data)
    this.current_habilitacion = utils.getNestedOrChildNestedValue(this.habilitaciones, this.key)
    this.headers = utils.getKeysOrChildKeys(this.current_habilitacion)
    this.headers.length === 0 ? this.headers = ['Numero'] : null
    console.log("What I need is: ", this.headers)
  }
  confirmAction(): void {
    this.habilitaciones[this.key as keyof typeof this.habilitaciones] = this.current_habilitacion
    this.save.emit(this.habilitaciones)
    console.log("Habilitaciones", this.habilitaciones)
    this.dialogRef.close()
  }  
  // On file Select
  onChange(event: Event) {
    const target = (event.target as HTMLInputElement).files!
    this.file = target[0]
  }
  confirmUpload(): Observable<number | undefined> {
    // Upload file
    this.file_upload = new FileUpload(this.file)
    this.file_upload.name = this.file_upload.file.name
    let [uploadTask, storageRef] = this.crud.pushFileToStorage(this.file_upload)
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL: string) => {
          this.file_upload.url = downloadURL
          this.current_habilitacion.File = this.file_upload
          this.dialog.open(SuccessDialogComponent,{data: {cant: 1, type: 'carga'}})
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }
}
