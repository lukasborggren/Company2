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
    this.authService.getUser(this.loginForm.value).subscribe((res) => {
      if (res.status === 'success') {
        this.authService.login(res.auth_token);
        this.router.navigate(['/home']);
      } else {
        this.isInvalid = true;
      }
    },
    err => {
      this.isInvalid = true;
      console.error(err);
    });
  }
}
