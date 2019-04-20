import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoading = false;
  constructor(private authService: PostService) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm){
    debugger;
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password).subscribe(() => {},() => {this.isLoading =false;});
  }

}
