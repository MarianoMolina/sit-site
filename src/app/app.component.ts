import { Component } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "SIT Argentina"
  permissions: string = ''
  correo: string = ''
  
  constructor(private router: Router, private store: AngularFirestore, public authService: AuthService) {

    authService.userDetails$.subscribe(data => {
      if (data != null) {
        this.correo = data.email ? data.email : ''
      }
    })
    authService.permissions$.subscribe(data =>{
      if (data != null ){
        this.permissions = data
        // if(this.permissions == 'admin' || this.permissions == 'sadmin'){
        //   this.title = 'Usuario Administrador'
        // }
      }
    })
  }
  menuClicked(route: string){
    if (route === 'log_out') this.authService.logout()
    else this.router.navigateByUrl('/'+route);
  }
  signOut() {
    this.authService.logout();
    // this.title = 'Portal de Clientes'
  }
  goToHome() {
    this.router.navigateByUrl('').then(()=>window.location.reload());
  }
  goToSettings(){
    this.router.navigateByUrl('panel-usuario')
  }
}