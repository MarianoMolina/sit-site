import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'app/dialog/confirm-dialog/confirm-dialog.component'
import { CrudService } from 'app/services/crud-service.service'
import { Contacto, Datos_personales, new_contacto, RelacionTelefono, Transportista } from 'app/services/utils.service'
import { map, Subject, takeUntil } from 'rxjs'

import { SuccessDialogComponent } from 'app/dialog/success-dialog/success-dialog.component'
import { UtilsService } from 'app/services/utils.service'
import { TransportistaDialogComponent } from 'app/dialog/transportista-dialog/transportista-dialog.component'

declare var google: any;
@Component({
  selector: 'app-add-transportista',
  templateUrl: './add-transportista.component.html',
  styleUrls: ['./add-transportista.component.css']
})
export class AddTransportistaComponent {

  @ViewChild('search') public searchElementRef!: ElementRef
  multi_add_hide: boolean = true
  file: File | any = null; // Variable to store file

  constructor(private dialog: MatDialog, private crud: CrudService, public utils: UtilsService) {
    
  }
  selectOption(option: string, event: MouseEvent){
    event.stopPropagation();
    if(option == "single") {
      this.multi_add_hide = true
      this.dialog.open(TransportistaDialogComponent, {
        data: {
          type: 'create'
        }
      })
    } else if (option == "multi") {
      this.multi_add_hide = false
    }
  }
  // On file Select
  onChange(event: Event) {
    const target = (event.target as HTMLInputElement).files!
    this.file = target[0]
    console.log(event)
    console.log(this.file)
  }
  confirmAction(){
    this.onUpload(this.file)
  }
  // OnClick of button Upload
  onUpload(file: File) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.componentInstance.save.subscribe((res) => {
      if (res){
        console.log("FILE:", file)
        let success = new Subject()
        this.crud.getAllContacts().snapshotChanges()
        .pipe(map(changes => changes.map(c =>({cod: c.payload.doc.id, ...c.payload.doc.data() })))).pipe(takeUntil(success))
        .subscribe(contactos => {
          let file_read: FileReader = new FileReader()
          let contactArray: Transportista[] = []
          file_read.onloadend = (e) => {
            let clean_file = file_read.result as string
            console.log("Result", clean_file)
            let csvToRowArray = clean_file.split("\n")
            console.log("row array",csvToRowArray)
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(",")
              let full_number = row[1].replace(/"|\/|\-|\+/g, '').split(" ")
              let tel_completo = parseInt(row[1].replace(/"|\/|\-|\+|\s/g, ''),10)
              if (this.checkIfContactIsNew(tel_completo, contactos)) {
                let contacto: Contacto = new_contacto()
                contacto.Nombre = row[0].replace(/"|\//g, '');
                contacto.cod = parseInt(full_number[0],10);
                contacto.area = parseInt(full_number[1],10);
                contacto.telefono = parseInt(full_number[2]+full_number[3],10);
                contacto.telefono_completo = tel_completo;
                let datos_personales: Datos_personales = {
                  Status_whatsapp: row[2].replace(/"|\//g, '')
                }
                let transportista: Transportista = {
                  Telefonos: [contacto], 
                  Telefono_principal: tel_completo,
                  Fecha_alta: new Date(),
                  Status: "Contacto", // TIPOS_STATUS
                  Datos_personales: datos_personales,
                  Nombre: contacto.Nombre
                }
                contactArray.push(transportista);
              }
            }
            console.log("Full array:", contactArray)
            let cant_creada = contactArray.length
            this.crud.batchAddTransportista(contactArray)
            let dialogRef2 = this.dialog.open(SuccessDialogComponent,{data:{cant: cant_creada, type: 'carga'}})

          }
          file_read.readAsText(file)
          success.next(true)
        })
      }
    })
  }
  checkIfContactIsNew(telefono: number, contactos: RelacionTelefono[]): boolean {
    let isNew: boolean = true
    if (contactos.length>0) {
      contactos.forEach(contacto =>{
        if(contacto.telefono_completo === telefono) isNew = false
      })
    }
    return isNew
  }
}