import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes'

export var separatorKeysCodes: number[] = [ENTER, COMMA]

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  
  addChip(event: MatChipInputEvent, array: string[], control: FormControl<string|null>) {
    this.addToArray(event.value, array)
    // Clear the input value
    event.chipInput!.clear();
    control.setValue(null);
  }
  addToArray(el: string, array: string[]) {
    const value = (el || '').trim()
    if (value) {
      array.push(value);
    }
  }
  removeFromArray(el: string, selected_array: string[]) {
    const index = selected_array.indexOf(el);
    if (index >= 0) {
      selected_array.splice(index, 1);
    }
  }
  _filter(value: string, array: string[]): string[] {
    const filterValue = value.toLowerCase();
    return array.filter(value => value.toLowerCase().includes(filterValue));
  }
  getNestedValue(obj: any, key: string): any {
    return key.split(".").reduce(function(result, key) {
       return result[key] 
    }, obj);
  }
  getNestedOrChildNestedValue(obj: any, key: string): any {
    if (obj.length > 0) return this.getNestedValue(obj[0], key)
    else return this.getNestedValue(obj, key)
  }
  getKeys(obj:any): any {
    return Object.keys(obj)
  }
  getKeysOrChildKeys(obj:any): any {
    if (obj.length > 0) return this.getKeys(obj[0])
    else return this.getKeys(obj)
  }
  createCSV(array: any[][], title?: string){
    let csvContent = "data:text/csv;charset=utf-8,"

    array.forEach(rowArray => {
        let row = rowArray.join(",")
        csvContent += row + "\r\n"
    })
    let encodedUri = encodeURI(csvContent)
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", title ? title : "Descarga_SIT" +".csv");
    document.body.appendChild(link); // Required for FF
    link.click()
  }
}
export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  file: File;
  constructor(file: File) {
    this.file = file;
  }
}
export var Permissions = [
  'sadmin', 
  'admin', 
  'user', 
  'client'
]
export var RUBROS = [
  "Alimentos", 
  "Petróleo", 
  "Maquinería", 
  "Carga peligrosa"
]
export var PROVINCIAS = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  "Tucumán"
]
export var REGIONES = [
  "Norte", 
  "Cuyo", 
  "Centro",
  "Patagonia"
]
export var TIPOS_STATUS = [
  "Activo", 
  "Inactivo", 
  "Desaprobado", 
  "Aprobado",
  "Contacto"
]
export var TIPOS_TRANSPORTISTA = [
  "Dueño", 
  "Chofer", 
  "Empresa"
]
export var TIPOS_REGION = [
  "Provincia", 
  "Ciudad", 
  "Region"
]
export var TIPOS_VEHICULO = [
  "Semi", 
  "Tractor"
]
export var TIPOS_UNIDAD = [
  "Baranda", 
  "Chasis AC", 
  "Sider", 
  "Furgon", 
  "Batea", 
  "Chassis", 
  "Balancines", 
  "Tolva", 
  "Playo", 
  "Camioneta"
]
export interface Usuario {
  email: string
  uid: string
  role: string
  clientid?: string
  displayName: string
}
export interface RelacionTelefono {
  telefono_completo: number
  key_owner: string
}
export interface Contacto {
  Nombre: string
  cod: number
  area: number
  telefono: number
  telefono_completo: number
  ID: string
}
export interface Region {
  tipo: string, // TIPOS_REGION
  nombre: string // PROVINCIAS o REGIONES
}
export interface Transportista {
  Telefonos: Contacto[]
  Telefono_principal: number
  Fecha_alta: Date
  Status: string // TIPOS_STATUS
  Nombre?: string
  Razon_social?: string
  Tipo?: string // TIPOS_TRANSPORTISTA
  CUIT?: number
  Ubicacion?: string
  Datos_personales?: Datos_personales
  Zonas_Interes?: Region[]
  Equipos?: Equipo[]
  _db_id?: string
  Comentarios?: string
}
export interface Datos_personales {
  Comentarios?: string, 
  Status_whatsapp?: string
}
export interface Equipo {
  ID: string
  Telefono: Contacto
  Tipo_Unidad: string[] // TIPOS_UNIDAD
  Capacidad: number
  Rubro?: string[]
  Situacion_cubiertas?: string
  Habilitaciones?: Habilitaciones
}
const uid = function(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
export interface Cedula extends Habilitacion_imagen {
  Numero?: number
  Tipo_vehiculo: string // TIPOS_VEHICULO
}
export interface Cobertura_Seguro extends Habilitacion_imagen {
  Tipo_vehiculo: string // TIPOS_VEHICULO
}
export interface Habilitacion_imagen {
  File: FileUpload
  Fecha: string
}
export interface Habilitaciones {
  DNI?: number // Tier 1
  Licencia?: number
  Cedula_verde?: Cedula[]
  Cobertura_seguro?: Cobertura_Seguro[]
  Poliza_seguro?: Habilitacion_imagen // Tier 1
  Titulo?: Habilitacion_imagen // Tier 2
  VTV?: Habilitacion_imagen 
  Ruta?: Habilitacion_imagen
  Linti?: Habilitacion_imagen
  Seguro_vida?: Habilitacion_imagen
  Clausula_no_repeticion?: Habilitacion_imagen // Tier 2
  Sindicato?: Habilitacion_imagen // Tier 3
  Alta_temprana?: Habilitacion_imagen
  _931?: Habilitacion_imagen
  Senasa?: Habilitacion_imagen
  Bromatologia?: Habilitacion_imagen
  Carga_peligrosa?: Habilitacion_imagen // Tier 3
}
export const new_dat_personales = (): Datos_personales =>({
  Comentarios: '', 
  Status_whatsapp: ''
})
export const new_contacto = (): Contacto =>({
  Nombre: '',
  cod: NaN,
  area: NaN,
  telefono: NaN,
  telefono_completo: NaN, 
  ID: uid()
})
export const new_transportista = (): Transportista =>({
  Telefonos: [],
  Telefono_principal: NaN,
  Fecha_alta: new Date(),
  Status: '' ,// TIPOS_STATUS
  Nombre: '',
  Razon_social: '',
  Tipo: '' ,// TIPOS_TRANSPORTISTA
  CUIT: NaN,
  Ubicacion: '',
  Datos_personales: new_dat_personales(),
  Zonas_Interes: [],
  Equipos: [],

})
export const new_equipo = (): Equipo =>({
  Telefono: new_contacto(),
  Tipo_Unidad: [],
  Capacidad: NaN,
  Rubro: [],
  Situacion_cubiertas: '', 
  Habilitaciones: new_habilitacion(),
  ID: uid()
})
export const new_file = (): FileUpload =>({
  key: '',
  name: '',
  url: '' , 
  file: new File([],'empty.txt')
})
export const new_cedula = (): Cedula =>({
  Numero: NaN,
  Tipo_vehiculo: '', // TIPOS_VEHICULO
  File: new_file(),
  Fecha: '',
})
export const new_seguro = (): Cobertura_Seguro =>({
  Tipo_vehiculo: '', // TIPOS_VEHICULO
  File: new_file(),
  Fecha: '',
})
export const new_hab_imagen = (): Habilitacion_imagen =>({
  File: new_file(),
  Fecha: '',
})
export const new_habilitacion = (): Habilitaciones =>({
  DNI: NaN,
  Licencia: NaN,
  Cedula_verde: [new_cedula()],
  Cobertura_seguro: [new_seguro()],
  Poliza_seguro: new_hab_imagen(), // Tier 1
  Titulo: new_hab_imagen(), // Tier 2
  VTV: new_hab_imagen(), 
  Ruta: new_hab_imagen(),
  Linti: new_hab_imagen(),
  Seguro_vida: new_hab_imagen(),
  Clausula_no_repeticion: new_hab_imagen(), // Tier 2
  Sindicato: new_hab_imagen(), // Tier 3
  Alta_temprana: new_hab_imagen(),
  _931: new_hab_imagen(),
  Senasa: new_hab_imagen(),
  Bromatologia: new_hab_imagen(),
  Carga_peligrosa: new_hab_imagen() // Tier 3
})
export const habilitacion_keys = Object.keys(new_habilitacion())
