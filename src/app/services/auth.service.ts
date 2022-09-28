
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app"; 
import { BehaviorSubject, Observable } from 'rxjs';
import { CrudService } from './crud-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false)
  loggedIn$ = this.loggedIn.asObservable()
  userDetails = new BehaviorSubject<firebase.User|null>(null)
  userDetails$ = this.userDetails.asObservable()
  permissions = new BehaviorSubject<string>('')
  permissions$ = this.permissions.asObservable()
  client_id = new BehaviorSubject<string>('')
  client_id$ = this.client_id.asObservable()

  constructor(public dialog: MatDialog, private afAuth: AngularFireAuth, private router: Router, 
    private crud: CrudService, private store: AngularFirestore) {
    this.afAuth.onAuthStateChanged(user => this.onAuthStateChanged(user))
  }
  onAuthStateChanged(user: firebase.User | null): void {
    if (user) {
      this.userDetails.next(user)
      this.permissionCheck(this.userDetails.value?.uid)
      this.loggedIn.next(true)
      console.log("logged in")
      console.log("user: ", user)
    } else {
      console.log("not logged in")
      this.userDetails.next(null) 
      this.permissionCheck('')
      this.loggedIn.next(false);
    } 
  }
  permissionCheck(uid: string | undefined){
    if (uid == null || uid === '' || uid === undefined){
      this.permissions.next('none')
      this.client_id.next('')
    } else {
      this.crud.getUserById(uid).get().subscribe(data => {
        let rol = data.data()?.role
        if (rol != null && rol != undefined ) {
          this.permissions.next(rol)
          // this.client_id.next(data.data().client)
        } else {
          this.permissions.next('')
        }
      })
    }
  }
  // login(email: string, password: string) {
  //   this.afAuth.signInWithEmailAndPassword(email, password)
  //   .then(value => {
  //     console.log('Nice, it worked!');
  //     this.router.navigateByUrl('')
  //   })
  //   .catch(err => {
  //     this.dialog.open(ErrorDialogComponent, {data: "Ha ocurrido un error. Por favor revise que los datos son correctos y si no tiene una cuenta válida, cree una."})
  //     console.log('Something went wrong: ', err);
  //   });
  // }
  // emailSignup(email: string, password: string) {
  //   this.afAuth.createUserWithEmailAndPassword(email, password)
  //   .then(value => {
  //     console.log('Success', value);
  //     this.createUser(value);
  //     this.router.navigateByUrl('')
  //   })
  //   .catch(error => {
  //     if(error.message.includes("email-already-in-use")) {
  //       this.dialog.open(ErrorDialogComponent, {data: "Ese correo ya se encuentra en uso. Utilice otro o ingrese con esa cuenta."})
  //     } else {
  //       this.dialog.open(ErrorDialogComponent, {data: "Ha ocurrido un problema al intentar crear su cuenta. Por favor intente nuevamente."})
  //     }
  //     console.log('Something went wrong: ', error.message);
  //   });
  // }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(value => {
        if (value.additionalUserInfo?.isNewUser == true) {
          this.createUser(value)
        }
        console.log('Sucess', value);
        this.router.navigateByUrl('')
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }
  createUser(value: any){
    let uid = value.user?.uid
    let email = value.user?.email
    let displayName = value.user?.displayName
    // User is new so add it to the user database
    this.crud.createUser(uid, email, displayName)
    console.log("Value createuser", value)
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('')
    });
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider);
  }
}