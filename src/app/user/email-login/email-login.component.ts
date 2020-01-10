import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-email-login",
  templateUrl: "./email-login.component.html",
  styleUrls: ["./email-login.component.scss"]
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;
  type: "login" | "signup" | "reset" = "signup";
  serverMessage: string;
  loading = false;

  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ["", []]
    });
  }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === "login";
  }

  get isSignup() {
    return this.type === "signup";
  }

  get isPasswordReset() {
    return this.type === "reset";
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get passwordConfirm() {
    return this.form.get("passwordConfirm");
  }

  get passwordDoesMatch() {
    if (this.type !== "signup") {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;
    try {
      if (this.isLogin) {
        await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignup) {
        await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset) {
        await this.afAuth.auth.sendPasswordResetEmail(email);
        this.serverMessage = "Email Sent - Check Your Inbox";
      }
    } catch (e) {
      this.serverMessage = e;
    }
  }
}
