import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { AddTransportistaComponent } from './routes/add-transportista/add-transportista.component';
import { ListaTransportistaComponent } from './routes/lista-transportista/lista-transportista.component';
import { PriceCalcComponent } from './routes/price-calc/price-calc.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'calc', component: PriceCalcComponent },
  { path: 'nuevo_transportista', component: AddTransportistaComponent },
  { path: 'lista_transportistas', component: ListaTransportistaComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
