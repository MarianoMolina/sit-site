import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSelectChange } from '@angular/material/select'
import { Contacto, Equipo, habilitacion_keys, new_equipo, RUBROS } from  'app/services/utils.service'
import { TIPOS_UNIDAD } from  'app/services/utils.service'
import { UtilsService, separatorKeysCodes } from 'app/services/utils.service'
import { map, Observable, startWith } from 'rxjs'
import { AgregarHabilitacionDialogComponent } from '../agregar-habilitacion-dialog/agregar-habilitacion-dialog.component'
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component'

@Component({
  selector: 'app-create-equipo',
  templateUrl: './create-equipo.component.html',
  styleUrls: ['./create-equipo.component.css']
})
export class CreateEquipoComponent implements OnInit {
  equipo: Equipo
  separatorKeyCodes_ = separatorKeysCodes
  contactos: Contacto[]
  lista_telefonos: number[]
  telefono_elegido: number = NaN
  type: string
  
  tipos = TIPOS_UNIDAD
  tipos_elegidas: string[] = []
  filtered_tipos: Observable<string[]>
  tiposCtrl = new FormControl('')
  @ViewChild('tiposSelect') tiposSelect!: ElementRef<HTMLInputElement>

  rubros = RUBROS
  rubros_elegidas: string[] = []
  filtered_rubros: Observable<string[]>
  rubrosCtrl = new FormControl('')
  @ViewChild('rubrosSelect') rubrosSelect!: ElementRef<HTMLInputElement>

  habilitacion_keys = habilitacion_keys
  @Output() save = new EventEmitter<[Equipo, string]>()

  constructor(@Inject(MAT_DIALOG_DATA) public data: {equipo: Equipo, type: string, contactos: Contacto[]}, 
  public utils: UtilsService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) { 
    data != null ? this.equipo = data.equipo : this.equipo = new_equipo()
    this.contactos = data.contactos
    this.type = data.type
    this.lista_telefonos = this.contactos.map(a=> a.telefono_completo)
    this.filtered_tipos = this.tiposCtrl.valueChanges.pipe(
      startWith(null),
      map((tipo: string | null) => (tipo ? utils._filter(tipo, this.tipos) : this.tipos.slice())),
    )
    this.filtered_rubros = this.rubrosCtrl.valueChanges.pipe(
      startWith(null),
      map((tipo: string | null) => (tipo ? utils._filter(tipo, this.rubros) : this.rubros.slice())),
    )
    // this.habilitacion_keys.forEach(key=>{
    //   console.log("Habilitacion key", key, utils.getNestedValue(this.equipo.Habilitaciones,key))
    //   console.log("Output:", utils.getKeysOrChildKeys(utils.getNestedValue(this.equipo.Habilitaciones,key)))
    // })
  }
  deleteAction(){
    let newDialogRef = this.dialog.open(ConfirmDialogComponent)
    newDialogRef.componentInstance.save.subscribe((res) => {
      if (res){
        if (this.type === 'edit') this.save.emit([new_equipo(), 'delete']) 
        this.dialogRef.close()
      }
    })
  }
  updateContacto(event: MatSelectChange){
    console.log("event", event)
    this.equipo.Telefono = this.contactos.filter(a => a.telefono_completo === event.value)[0]
    console.log("Nuevo contacto", this.equipo.Telefono, this.contactos)
  }
  guardarEquipo(){
    if (this.check()) {
      this.equipo.Rubro = this.rubros_elegidas
      this.equipo.Tipo_Unidad = this.tipos_elegidas
      this.equipo.Telefono.telefono_completo = parseInt(this.equipo.Telefono.cod.toString() + this.equipo.Telefono.area.toString() + this.equipo.Telefono.telefono.toString())
      console.log("saving equipo: ", this.equipo)
      this.save.emit([this.equipo, 'save'])
      this.dialogRef.close()
    } else {
      this.dialog.open(ErrorDialogComponent, {data:'Por favor complete todos los campos obligatorios'})
    }
  }
  check(): boolean {
    if (this.equipo.Telefono.telefono === undefined || this.equipo.Telefono.telefono.toString().length === 0) return false
    if (this.equipo.Tipo_Unidad.length === 0) return false
    if (this.equipo.Capacidad.toString().length === 0) return false
    return true
  }
  tituloTemplateKey(key: string): string | number{
    if (key === "DNI" || key ===  "Licencia") {
      // Traer Habilitacion[key] = number
      return "Número"
    } else {
      // Traer Habilitacion[key][Fecha] = string
      return "Vigencia"
    }
  }
  datoTemplateKey(key: string): string {
    if (key === "DNI" || key ===  "Licencia") {
      // Traer Habilitacion[key] = number
      return isNaN(this.utils.getNestedOrChildNestedValue(this.equipo.Habilitaciones, key)) ? '' : this.utils.getNestedOrChildNestedValue(this.equipo.Habilitaciones, key)
    } else {
      // Traer Habilitacion[key][Fecha] = string
      return this.utils.getNestedOrChildNestedValue(this.equipo.Habilitaciones, key).Fecha
    }
  }
  addHabilitacion(key: string) {
    let dialogRef = this.dialog.open(AgregarHabilitacionDialogComponent, {
      data:{
        habilitaciones: this.equipo.Habilitaciones, 
        key: key, 
        type: 'create'
      }
    })
    dialogRef.componentInstance.save.subscribe((res: any) => {
      if (res){
        this.equipo.Habilitaciones = res
      }
    })
  }
  addTipo(tipo: MatChipInputEvent): void {
    this.utils.addToArray(tipo.value, this.tipos_elegidas)
    this.utils.removeFromArray(tipo.value, this.tipos)
    tipo.chipInput!.clear();
    this.tiposCtrl.setValue(null);
  }
  removeTipo(tipo: string): void {
    this.utils.removeFromArray(tipo, this.tipos_elegidas)
    this.tipos.push(tipo)
  }
  selectedTipo(event: MatAutocompleteSelectedEvent): void {
    this.tipos_elegidas.push(event.option.viewValue)
    this.utils.removeFromArray(event.option.viewValue, this.tipos)
    this.tiposSelect.nativeElement.value = ''
    this.tiposCtrl.setValue(null);
  }
  addRubro(rubro: MatChipInputEvent): void {
    this.utils.addToArray(rubro.value, this.rubros_elegidas)
    this.utils.removeFromArray(rubro.value, this.tipos)
    rubro.chipInput!.clear();
    this.rubrosCtrl.setValue(null);
  }
  removeRubro(rubro: string): void {
    this.utils.removeFromArray(rubro, this.rubros_elegidas)
    this.rubros.push(rubro)
  }
  selectedRubro(event: MatAutocompleteSelectedEvent): void {
    this.rubros_elegidas.push(event.option.viewValue)
    this.rubrosSelect.nativeElement.value = ''
    this.utils.removeFromArray(event.option.viewValue, this.rubros)
    this.rubrosCtrl.setValue(null);
  }

  ngOnInit(): void {
  }
}
