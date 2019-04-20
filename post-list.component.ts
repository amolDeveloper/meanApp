import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription;
  private authSub: Subscription;
  userIsAuthenticated: boolean =  false;
  isLoading = false;
  userId: string;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 7, 10];
  constructor(public postSer: PostService) { }

  ngOnInit() {
    this.postSer.fetchPosts(this.postsPerPage, this.currentPage);
    this.userId = this.postSer.getUserId();
    this.isLoading = true;
    this.postSub = this.postSer.getPosts().subscribe((postData: {post: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.post;
      this.totalPosts = postData.postCount;
    });
    this.userIsAuthenticated = this.postSer.getIsAuth();
    this.authSub = this.postSer.getauthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.postSer.getUserId();
    })

  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  ondelete(id: string){
    debugger;
    this.postSer.deletePost(id).subscribe(() =>
    {
      this.postSer.fetchPosts(this.postsPerPage, this.currentPage);
    },
    () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postSer.fetchPosts(this.postsPerPage, this.currentPage);
  }
}
