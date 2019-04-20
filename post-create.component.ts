import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl,Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  newPost = 'No Content';
  posts: Post[] = [];
  form: FormGroup;
  imagePreview: any;
  private mode = 'create';
  private postID: string;
  isLoading = false;
  post: Post;
  constructor(public postser: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postID = paramMap.get('postId');
        this.isLoading = true;
        this.postser.getPost(this.postID)
        .subscribe((postData) => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content, creator: postData.creator};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        })
      } else {
        this.mode = 'create';
        this.postID = null;
      }
    });
  }

  onSavePost(){
    debugger;
    // if (this.form.invalid) {
    //   return;
    // }
    this.isLoading = true;
    if (this.mode === 'create'){
      this.postser.addPosts(this.form.value.title, this.form.value.content);
    } else {
      this.postser.updatePost( this.postID, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

}
