import { Component } from '@angular/core';
import { DomSanitizer  } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private authService: AuthService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) { 
    this.matIconRegistry.addSvgIcon("logo", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/googlelogo.svg"))
  }
  loginGoogle() {
    this.authService.googleLogin();
  }
}
