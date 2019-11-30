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
  loading: boolean = false;

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
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe((valid) => {
      if (valid) {
        this.router.navigate(['/scannerpage']);
      } else {
        this.isInvalid = true;
      }
      this.loading = false;
    },
    err => {
      this.isInvalid = true;
      console.error(err);
    });
  }
}
