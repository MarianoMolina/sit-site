import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { FileUpload, RelacionTelefono, Transportista, Usuario } from './utils.service'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private dbTranspPath = 'Transportistas'
  transpRef: AngularFirestoreCollection<Transportista>
  private dbContactPath = 'Contactos'
  contactRef: AngularFirestoreCollection<RelacionTelefono>
  private dbUserPath = 'Usuarios'
  userRef: AngularFirestoreCollection<Usuario>
  private basePath = '/uploads';
  
  constructor(private db: AngularFireDatabase, private firestore: AngularFirestore, private dialog: MatDialog, private router: Router, 
    private storage: AngularFireStorage) {
    this.transpRef = firestore.collection(this.dbTranspPath)
    this.contactRef = firestore.collection(this.dbContactPath)
    this.userRef = firestore.collection(this.dbUserPath)
  }
  createUsuario(usuario: Usuario): any {
    return this.userRef.add({ ...usuario })
  }
  getUserById(uid: string): AngularFirestoreDocument<Usuario>{
    return this.userRef.doc(uid)
  }
  pushFileToStorage(fileUpload: FileUpload): any[] {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file)
    return [uploadTask, storageRef]
  }
  deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
  getAllContacts(): AngularFirestoreCollection<RelacionTelefono>{
    return this.contactRef
  }
  getAllTransportistas(): AngularFirestoreCollection<Transportista> {
    return this.transpRef
  }
  getLastTransportista(): AngularFirestoreCollection<Transportista>{
    return this.firestore.collection(this.dbTranspPath, ref => ref.orderBy('Fecha_alta', 'desc').limit(1))
  }
  getTransportistaById(transp_id: string): AngularFirestoreDocument<Transportista>{
    return this.transpRef.doc(transp_id)
  }
  createTransportista(transportista: Transportista): any {
    return this.transpRef.add({ ...transportista })
  }
  updateTransportista(id: string, data: Transportista): Promise<void> {
    if (id === '') return this.createTransportista(data)
    else return this.transpRef.doc(id).update({...data})
  }
  deleteTransportista(id: string): Promise<void> {
    return this.transpRef.doc(id).delete()
  }
  batchAddTransportista(transportistas: Transportista[]): Promise<void>{
    const batch = this.firestore.firestore.batch()
    transportistas.forEach(transportista =>{
      const docRef = this.transpRef.doc().ref
      transportista.Telefonos.forEach(contacto =>{ 
        const relRef = this.contactRef.doc().ref
        const relTel: RelacionTelefono = {
          telefono_completo: contacto.telefono_completo,
          key_owner: docRef.id
        }
        batch.set(relRef, {...relTel})
      })
      batch.set(docRef, {...transportista})
    })
    return batch.commit()
  }
  createUser(uid: string, email: string, displayName: string): Promise<void>{
    return this.userRef.doc(uid).set({
      email: email,
      uid: uid, 
      displayName: displayName, 
      role: ''
    })

  }
}