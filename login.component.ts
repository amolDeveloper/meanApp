import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  onFormSubmit(form: NgForm){
    debugger;
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    this.postService.loginUser(email,password);
  }

}
