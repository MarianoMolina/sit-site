import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TablaClientesComponent } from './dialog/tabla-clientes/tabla-clientes.component'
import { MatTableModule } from '@angular/material/table'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatMenuModule} from '@angular/material/menu';
import { PriceCalcComponent } from './routes/price-calc/price-calc.component';
import { AddTransportistaComponent } from './routes/add-transportista/add-transportista.component';
import { ListaTransportistaComponent } from './routes/lista-transportista/lista-transportista.component';
import { HomeComponent } from './routes/home/home.component'
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { GoogleMapsModule } from '@angular/google-maps'
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort'
import { CrudService } from './services/crud-service.service'
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { environment } from '../environments/environment'
import {MatSelectModule} from '@angular/material/select'
import {MatChipsModule} from '@angular/material/chips'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {ReactiveFormsModule} from '@angular/forms'
import {MatTooltipModule} from '@angular/material/tooltip';
import { CreateEquipoComponent } from './dialog/create-equipo/create-equipo.component';
import { SuccessDialogComponent } from './dialog/success-dialog/success-dialog.component'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import { AgregarHabilitacionDialogComponent } from './dialog/agregar-habilitacion-dialog/agregar-habilitacion-dialog.component'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { TransportistaDialogComponent } from './dialog/transportista-dialog/transportista-dialog.component'
import { ContactoDialogComponent } from './dialog/contacto-dialog/contacto-dialog.component'
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component'
import { SignupComponent } from './routes/signup/signup.component'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { LottieModule } from 'ngx-lottie'
import player from 'lottie-web'
import { UtilsService } from './services/utils.service'
import { AuthService } from './services/auth.service'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    AppComponent,
    TablaClientesComponent,
    PriceCalcComponent,
    AddTransportistaComponent,
    ListaTransportistaComponent,
    HomeComponent,
    ConfirmDialogComponent,
    CreateEquipoComponent,
    SuccessDialogComponent,
    AgregarHabilitacionDialogComponent,
    TransportistaDialogComponent,
    ContactoDialogComponent,
    ErrorDialogComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatProgressSpinnerModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatSlideToggleModule
  ],
  providers: [CrudService, UtilsService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
