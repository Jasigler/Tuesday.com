import {Directive, HostListener} from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {tryCatch} from 'rxjs/internal-compatibility';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {

  constructor(private afAuth: AngularFireAuth) { }

  @HostListener('click')
    onClick() {
      try{
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      } catch (e) {
        console.log(e);
      }
  }
}
