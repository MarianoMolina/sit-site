import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'app/services/auth.service'
import { AnimationItem } from 'lottie-web'
import { AnimationOptions } from 'ngx-lottie'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit{
  role: string = ''
  finished_loading: boolean = false;
  logged: boolean = false
  animationItem?: AnimationItem
  options: AnimationOptions = {    
    path: '/assets/lottie/wait.json'  
  }; 
  permissionsubscribe?: Subscription

  constructor(public authService: AuthService, private router: Router) {
  }
  onAnimate(animationItem: AnimationItem): void {     
    this.animationItem = animationItem;  
  }
  ngOnInit(): void {
    this.permissionsubscribe = this.authService.permissions$.subscribe((data:string) => {
      if (data != undefined && data != null && data != '') {
        this.role = data
        this.finished_loading = true
      }
    })      
  }
  ngOnDestroy(): void {
    this.permissionsubscribe?.unsubscribe()
  }

  menuClicked(route: string){
    this.router.navigateByUrl('/'+route);
  }
}
