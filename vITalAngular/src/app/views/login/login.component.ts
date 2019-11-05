import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isInvalid: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
    this.isInvalid = false;
  }
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    // Call login validation here
    if (true) {
      this.authService.login(this.loginForm.value);
      this.router.navigate(['/home']);
    } else {
      this.isInvalid = true;
    }
  }
}
