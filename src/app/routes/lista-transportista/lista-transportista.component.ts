import { Component, ElementRef, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import {SelectionModel} from '@angular/cdk/collections'
import { CrudService } from 'app/services/crud-service.service'
import { PROVINCIAS, REGIONES, RUBROS, TIPOS_STATUS, TIPOS_TRANSPORTISTA, Transportista } from 'app/services/utils.service'
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs'
import { FormControl } from '@angular/forms'
import { MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatChipInputEvent } from '@angular/material/chips'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { UtilsService } from 'app/services/utils.service'
import { separatorKeysCodes } from 'app/services/utils.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { TransportistaDialogComponent } from 'app/dialog/transportista-dialog/transportista-dialog.component'
import { AuthService } from 'app/services/auth.service'

@Component({
  selector: 'app-lista-transportista',
  templateUrl: './lista-transportista.component.html',
  styleUrls: ['./lista-transportista.component.css']
})
export class ListaTransportistaComponent {
  finished_loading: boolean = false
  displayedColumns: string[] = ['select','Fecha_alta', 'Nombre', 'Telefono_principal', 'Status']
  dataSource: MatTableDataSource<Transportista> = new MatTableDataSource()

  status = TIPOS_STATUS
  tipos_transportistas = TIPOS_TRANSPORTISTA
  zonas_interes = PROVINCIAS.concat(REGIONES)
  separatorKeysCodes = separatorKeysCodes
  rubros = RUBROS
  @ViewChild('select_status') select_status!: MatButtonToggleGroup
  @ViewChild('select_tipos') select_tipos!: MatButtonToggleGroup
  @ViewChild('select_rubros') select_rubros!: MatButtonToggleGroup
  filtered_zonas: Observable<string[]>
  zonas_elegidas: string[] = []
  zonaCtrl = new FormControl('')
  @ViewChild('zonaSelect')
  zonaSelect!: ElementRef<HTMLInputElement>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  input_filter: string = ''
  
  selection = new SelectionModel<Transportista>(true, []);

  transportistas: Transportista[] = []
  transportistas_filtrados: Transportista[] = []

  constructor(private crud: CrudService, private utils: UtilsService, private dialog: MatDialog, public authService: AuthService) {
    this.filtered_zonas = this.zonaCtrl.valueChanges.pipe(
      startWith(null),
      map((tipo: string | null) => (tipo ? utils._filter(tipo, this.zonas_interes) : this.zonas_interes.slice())),
    )
    let success = new Subject()
    this.crud.getAllContacts().snapshotChanges()
    crud.getAllTransportistas().snapshotChanges()
    .pipe(map(changes => changes.map(c =>({_db_id: c.payload.doc.id, ...c.payload.doc.data() })))).pipe(takeUntil(success))
    .subscribe(transportistas => {
      this.transportistas = transportistas
      this.transportistas_filtrados = this.transportistas
      console.log("TRANSPORTISTAS: ", transportistas)
      this.capturar()
    })
  }
  descargarCSV() {
    let contactArray: any[][] = []
    this.selection.selected.forEach(transportista => {
      transportista.Telefonos.forEach(contacto => {
        contactArray.push([contacto.Nombre, contacto.telefono_completo])
      })
    })
    let length = contactArray.length
    let title = "Contactos Seleccionados[" + length + "][" + new Date().toISOString().split("T")[0] + "]"
    this.utils.createCSV(contactArray, title)
  }
  addZona(zona: MatChipInputEvent): void {
    this.utils.addToArray(zona.value, this.zonas_elegidas)
    this.utils.removeFromArray(zona.value, this.zonas_interes)
    zona.chipInput!.clear();
    this.zonaCtrl.setValue(null)
    this.capturar()
  }
  removeZona(zona: string): void {
    this.utils.removeFromArray(zona, this.zonas_elegidas)
    this.zonas_interes.push(zona)
    this.capturar()
  }
  openTransportista(transportista: Transportista){
    this.dialog.open(TransportistaDialogComponent, {
      data: {
        Transportista: transportista, 
        type: 'edit'
      }
    })
  }
  selectedZona(event: MatAutocompleteSelectedEvent): void {
    this.zonas_elegidas.push(event.option.viewValue)
    this.zonaSelect.nativeElement.value = ''
    this.utils.removeFromArray(event.option.viewValue, this.zonas_interes)
    this.zonaCtrl.setValue(null)
    this.capturar()
  }
  capturar() {
    this.finished_loading = false
    this.transportistas_filtrados = this.transportistas
    const rubro_sel = this.select_rubros.value.length > 0 ? this.select_rubros.value : null
    const sel_status = this.select_status.value.length > 0 ? this.select_status.value : null
    const sel_tipos = this.select_tipos.value.length > 0 ? this.select_tipos.value : null
    const sel_zonas = this.zonas_elegidas.length > 0 ? this.zonas_elegidas : null
    const filterValue: string = this.input_filter != undefined ? this.input_filter.trim().toLowerCase() : ''
    if (rubro_sel != null && rubro_sel.length > 0) {
      this.transportistas_filtrados = this.transportistas_filtrados.filter(p => p.Equipos?.some(r => r.Rubro?.some(el => rubro_sel!.includes(el))));
    } 
    if (sel_status != null && sel_status.length > 0) {
      this.transportistas_filtrados = this.transportistas_filtrados.filter(p => sel_status!.includes(p.Status))
    }
    if (sel_tipos != null && sel_tipos.length > 0) {
      this.transportistas_filtrados = this.transportistas_filtrados.filter(p => sel_tipos!.includes(p.Tipo))
    }
    if (sel_zonas != null && sel_zonas.length > 0) {
      this.transportistas_filtrados = this.transportistas_filtrados.filter(p => p.Zonas_Interes?.some(zi => sel_zonas!.includes(zi.nombre)))
    }
    this.dataSource = new MatTableDataSource(this.transportistas_filtrados)
    if (filterValue != null && filterValue.length > 0) {
      this.applyFilter(filterValue)
    }
    this.refreshSource()
  }
  filterEvent(event: Event) {
    this.applyFilter((event.target as HTMLInputElement).value)
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refreshSource(){
    this.dataSource = new MatTableDataSource(this.transportistas_filtrados)
    this.setPaginatorSort()
    this.finished_loading = true
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  setPaginatorSort(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  downloadCSV(){
    let headers: string[] = []
    let data: string[] = []
    this.transportistas_filtrados
  }
}