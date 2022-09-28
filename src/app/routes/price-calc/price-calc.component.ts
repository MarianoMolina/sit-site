import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TablaClientesComponent } from 'app/dialog/tabla-clientes/tabla-clientes.component';

@Component({
  selector: 'app-price-calc',
  templateUrl: './price-calc.component.html',
  styleUrls: ['./price-calc.component.css']
})
export class PriceCalcComponent {
  title = 'SIT-argentina'
  @Input() tarifa: number = 0
  @Input() lag_pago: number = 30
  @Input() lag_cobro: number = 30
  @Input() com_empleado: number = 20
  @Input() inflacion_mensual: number = 5
  @Input() com_por_venta: number = 5
  @Input() rentabilidad_deseada: number = 15
  tipo_tarifa: boolean = false
  imp: number = 0.35
  tarifa_deseada: number = 0
  aumento_tarifa: number = 0
  COM_T_v: number = 0
  RB_v: number = 0
  IMP_v: number = 0
  COM_E_v: number = 0
  RN_n_v: number = 0
  RN_f_v: number = 0

  constructor(public dialog: MatDialog){
    const dialogRef = this.dialog.open(TablaClientesComponent, {
      width: '550px',
      data: this.tabla,
    })
    dialogRef.close()
  }
  texto_tarifa(tipo: boolean): string {
    if (tipo) return 'Transportista'
    else return 'Cliente'
  }
  updateTarifa(){
    let cv = this.com_por_venta / 100
    let ce = this.com_empleado / 100
    let lp = this.lag_pago / 30 * this.inflacion_mensual / 100
    let lc = this.lag_cobro / 30 * this.inflacion_mensual / 100
    let rn = this.rentabilidad_deseada / 100
    this.tarifa_deseada = this.calcular_tarifa_deseada(rn, this.tarifa, cv, ce, lp, lc, this.imp, this.tipo_tarifa)
    if (this.tipo_tarifa) {
      // tarifa === TT
      this.COM_T_v = this.tarifa * cv
      this.RB_v = this.tarifa_deseada - this.tarifa + this.COM_T_v
      this.IMP_v = this.RB_v * this.imp
      this.COM_E_v = (this.RB_v - this.IMP_v) * ce
      this.RN_n_v = this.RB_v - this.COM_E_v - this.IMP_v
      this.aumento_tarifa = this.tarifa_deseada / this.tarifa - 1
      this.RN_f_v = rn * this.tarifa_deseada
    } else {
      // tarifa === TC
      this.COM_T_v = this.tarifa_deseada * cv
      this.RB_v = this.tarifa - this.tarifa_deseada + this.COM_T_v
      this.IMP_v = this.RB_v * this.imp
      this.COM_E_v = (this.RB_v - this.IMP_v) * ce
      this.RN_n_v = this.RB_v - this.COM_E_v - this.IMP_v
      this.aumento_tarifa = this.tarifa / this.tarifa_deseada - 1
      this.RN_f_v = rn * this.tarifa
    }
  }
  calcular_tarifa_deseada(rentabilidad_deseada: number, tarifa: number, ct: number, ce: number, lp: number, lc: number, imp: number, tipo: boolean): number {
    let K_i_ce = (1 - imp) * (1 - ce) / (1 + lc)
    let ICE = 1 - imp + imp * ce - ce
    let y = (rentabilidad_deseada/ICE - 1)/(ct - 1)
    console.log("Y", y)
    let ajuste_pago = (1+this.inflacion_mensual / 100)**(this.lag_pago / 30 )
    let ajuste_cobro = (1+this.inflacion_mensual / 100)**(this.lag_cobro / 30 )
    let tarifa_deseada
    if (tipo) {
      // tarifa === TT
      // let tarifa_neta_va = tarifa * (1 - ct) / (1 + lp)
      // tarifa_deseada = - (tarifa_neta_va * K_i_ce) / (rentabilidad_deseada - K_i_ce)
      let TT_va = tarifa / ajuste_pago
      tarifa_deseada = TT_va / (y * ajuste_pago)
    } else {      
      // tarifa_deseada = - tarifa * ((rentabilidad_deseada - K_i_ce) / K_i_ce ) / (1 - ct) * (1 / (1 + lp))
      // tarifa === TC
      let TC_va = tarifa / ajuste_cobro
      tarifa_deseada = TC_va*y/ajuste_cobro
    }
    return tarifa_deseada
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    this.updateTarifa()
    return true;
  }
  openDialog(): void {
    this.dialog.open(TablaClientesComponent, {
      data: this.tabla,
    })
  }
  tabla = [
    {
      cliente: 'CLIENTE ADDINGS',
      col1: "", 
      col2: "", 
      col3: "55"
    },
    {
      cliente: 'CLIENTE AGRO SELEME SRL',
      col1: "30 días fecha factura", 
      col2: "", 
      col3: "67"
    },
    {
      cliente: 'CLIENTE AMAUTA',
      col1: "15 días fecha factura", 
      col2: "", 
      col3: "24.65"
    },
    {
      cliente: 'CLIENTE ATILIO ALFALFA',
      col1: "15 días fecha factura", 
      col2: "", 
      col3: "23.13"
    },
    {
      cliente: 'CLIENTE FYO',
      col1: "30 días fecha factura", 
      col2: "", 
      col3: "23.89"
    },
    {
      cliente: 'CLIENTE HACHA DE PIEDRA',
      col1: "45/60 días fecha factura", 
      col2: "77.62", 
      col3: "83.26"
    },
    {
      cliente: 'CLIENTE IFLOW',
      col1: "45 días fecha factura", 
      col2: "69.68", 
      col3: "57.09"
    },
    {
      cliente: 'CLIENTE MORRESI',
      col1: "60 días fecha factura", 
      col2: "", 
      col3: "55"
    },
    {
      cliente: 'CLIENTE SAMAL',
      col1: "30 días fecha factura", 
      col2: "", 
      col3: "50"
    },
    {
      cliente: 'CLIENTE STOLLER',
      col1: "30 días fecha factura", 
      col2: "", 
      col3: "33.09"
    },
    {
      cliente: 'CLIENTE TRYLON',
      col1: "60 días fecha factura", 
      col2: "86", 
      col3: "90.64"
    }
  ]
}
