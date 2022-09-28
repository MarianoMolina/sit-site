import { Component, ElementRef, Inject, ViewChild } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CrudService } from 'app/services/crud-service.service'
import { Contacto, Equipo, new_contacto, new_equipo, new_transportista, REGIONES, TIPOS_STATUS, Transportista } from 'app/services/utils.service'
import { map, Observable,  startWith, } from 'rxjs'
import { TIPOS_TRANSPORTISTA, PROVINCIAS } from 'app/services/utils.service'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { FormControl } from '@angular/forms'
import {COMMA, ENTER} from '@angular/cdk/keycodes'
import { CreateEquipoComponent } from 'app/dialog/create-equipo/create-equipo.component'
import { UtilsService } from 'app/services/utils.service'
import { ContactoDialogComponent } from '../contacto-dialog/contacto-dialog.component'
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component'
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import { ThisReceiver } from '@angular/compiler'

@Component({
  selector: 'app-transportista-dialog',
  templateUrl: './transportista-dialog.component.html',
  styleUrls: ['./transportista-dialog.component.css']
})
export class TransportistaDialogComponent {
  current_transportista: Transportista
  tipos = TIPOS_TRANSPORTISTA
  status  = TIPOS_STATUS

  lista_telefonos: number[] = []

  type: string

  file: File | any = null; // Variable to store file

  ubicacion: string = ''

  separatorKeysCodes: number[] = [ENTER, COMMA]

  provincias = PROVINCIAS
  filtered_provincias: Observable<string[]>
  provincias_elegidas: string[] = []
  provinceCtrl = new FormControl('')
  @ViewChild('provinciaSelect')
  provinciaSelect!: ElementRef<HTMLInputElement>

  regiones = REGIONES
  filtered_regiones: Observable<string[]>
  regiones_elegidas: string[] = []
  regionesCtrl = new FormControl('')
  @ViewChild('regionSelect')
  regionSelect!: ElementRef<HTMLInputElement>

  constructor(private dialog: MatDialog, private crud: CrudService, public utils: UtilsService, 
    @Inject(MAT_DIALOG_DATA) private data: {Transportista: Transportista, type: string}, private dialogRef: MatDialogRef<any>) {
    console.log("DAta", data)
    this.type = data.type
    if (this.type === 'create') this.current_transportista = new_transportista()
    else if (this.type === 'edit') this.current_transportista = data.Transportista
    else this.current_transportista = new_transportista()
    console.log("current_transportista", this.current_transportista)
    this.lista_telefonos = this.current_transportista.Telefonos.map(a=> a.telefono_completo)
    this.filtered_provincias = this.provinceCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? utils._filter(fruit, this.provincias) : this.provincias.slice())),
    )
    this.filtered_regiones = this.regionesCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? utils._filter(fruit, this.regiones) : this.regiones.slice())),
    )
  }
  deleteAction(){
    let dialogRef2 = this.dialog.open(ConfirmDialogComponent)
    dialogRef2.componentInstance.save.subscribe((res) => {
      if (res){
        const id = this.current_transportista._db_id ? this.current_transportista._db_id : ''
        this.crud.deleteTransportista(id)
        this.dialogRef.close()
      }
    })
  }
  guardarTransportista(){
    console.log("Check: ", this.current_transportista.Telefonos, this.check())
    if (this.check()) {
      if (this.type === 'edit') {
        const id = this.current_transportista._db_id ? this.current_transportista._db_id : ''
        delete this.current_transportista['_db_id']
        this.crud.updateTransportista(id, this.current_transportista)
        // Add check for new contacts to add
      } else if (this.type === 'create') {
        let dialogRef = this.dialog.open(ConfirmDialogComponent)
        dialogRef.componentInstance.save.subscribe((res) => {
          if (res){
            this.current_transportista.Status = 'Aprobado'
            this.crud.batchAddTransportista([this.current_transportista])
            this.dialogRef.close()
          }
        })
      }
    } else {
      this.dialog.open(ErrorDialogComponent, {data:'Por favor completar todos los campos necesarios antes de guardar el transportista'})
    }
  }
  check(): boolean {
    if (this.current_transportista.Telefonos === undefined || this.current_transportista.Telefonos.length === 0) return false
    else if (this.current_transportista.Telefono_principal.toString() === 'NaN' || this.current_transportista.Telefono_principal.toString().length === 0) return false
    return true
  }
  addContacto(){
    let dialogRef = this.dialog.open(ContactoDialogComponent, {
      data: {
        contacto: new_contacto(), 
        type: 'create'
      }
    })
    dialogRef.componentInstance.save.subscribe((res: [Contacto, string]) => {
      if (res && res[1] != 'cancel_create'){
        this.current_transportista.Telefonos?.push(res[0])
        this.lista_telefonos = this.current_transportista.Telefonos.map(a=> a.telefono_completo)
      }
    })
  }
  editContacto(contacto: Contacto) {
    let dialogRef = this.dialog.open(ContactoDialogComponent, {
      data: {
        contacto: contacto, 
        type: 'edit'
      }
    })
    dialogRef.componentInstance.save.subscribe((res: [Contacto, string]) => {
      if (res){
        if (res[1] != 'delete') {
          this.current_transportista.Telefonos = this.current_transportista.Telefonos.map(obj=>{
            if (res[0].ID === obj.ID) return res[0]
            else return obj
          })
        } else {
          this.current_transportista.Telefonos = this.current_transportista.Telefonos.filter(cont => cont.ID !== contacto.ID)
        }
      } // cancel_edit does nothing
    })
  }
  addRegion(region: MatChipInputEvent): void {
    this.utils.removeFromArray(region.value, this.regiones)
    this.addChip(region, this.regiones_elegidas, this.regionesCtrl)
  }
  removeRegion(region: string): void {
    this.removeChip(region, this.regiones_elegidas)
  }
  selectedRegion(event: MatAutocompleteSelectedEvent): void {
    this.utils.removeFromArray(event.option.viewValue, this.regiones)
    this.regiones_elegidas.push(event.option.viewValue);
    this.regionSelect.nativeElement.value = '';
    this.regionesCtrl.setValue(null);
  }
  addProvincia(event: MatChipInputEvent): void {
    this.utils.removeFromArray(event.value, this.provincias)
    this.addChip(event, this.provincias_elegidas, this.provinceCtrl)
  }
  removeProvincia(provincia: string): void {
    this.removeChip(provincia, this.provincias_elegidas)
  }
  selectedProvincia(event: MatAutocompleteSelectedEvent): void {
    this.utils.removeFromArray(event.option.viewValue, this.provincias)
    this.provincias_elegidas.push(event.option.viewValue);
    this.provinciaSelect.nativeElement.value = '';
    this.provinceCtrl.setValue(null);
  }
  addChip(event: MatChipInputEvent, array: string[], control: FormControl<string|null>) {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      array.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    control.setValue(null);
  }
  removeChip(el: string, selected_array: string[]) {
    const index = selected_array.indexOf(el);
    if (index >= 0) {
      selected_array.splice(index, 1);
    }
  }
  addEquipo() {
    if (this.current_transportista.Telefonos.length > 0) {
      let dialogRef = this.dialog.open(CreateEquipoComponent,{
        data: {
          equipo: new_equipo(), 
          type: 'create', 
          contactos: this.current_transportista.Telefonos
        }
      })
      dialogRef.componentInstance.save.subscribe((res: [Equipo, string]) => {
        if (res){
          this.current_transportista.Equipos?.push(res[0])
        }
      })
    } else {
      this.dialog.open(ErrorDialogComponent, {data:'Para poder crear un equipo debe haber al menos 1 contacto registrado'})
    }
  }
  editEquipo(equipo: Equipo) {
    let dialogRef = this.dialog.open(CreateEquipoComponent, {
      data: {
        equipo: equipo, 
        type: 'edit',
        contactos: this.current_transportista.Telefonos
      }
    })
    dialogRef.componentInstance.save.subscribe((res: [Equipo, string]) => {
      if (res){
        if (res[1] === 'delete') {
          this.current_transportista.Equipos = this.current_transportista.Equipos?.filter(cont => cont.ID !== equipo.ID)
        } else {
          this.current_transportista.Equipos = this.current_transportista.Equipos?.map(obj=>{
            if (res[0].ID === obj.ID) return res[0]
            else return obj
          })
        }
      }
    })
  }
}