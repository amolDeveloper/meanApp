import { Post } from './post.model';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

const BACKEND_URL = environment.apiURL + "/posts/";
const BACKENDUSER_URL = environment.apiURL + "/user/";

@Injectable({ providedIn: 'root' })
export class PostService {
  private token: string;
  private authStataus = new Subject<boolean>();
  private isAuthenticated = false;
  private posts: Post[] = [];
  private tokenTimer: any;
  private userId: string;
  private postUpdated = new Subject<{ post: Post[], postCount: number }>();


  constructor(private http: HttpClient, private router: Router) { }

  fetchPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&Page=${currentPage}`;
    this.http.get<{ message: string, posts: { title: string, content: string, _id: string, creator: string }[], maxPosts: number }>
      (BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          post: postData.posts.map(postTo => {
            return {
              title: postTo.title,
              content: postTo.content,
              id: postTo._id,
              creator: postTo.creator
            }
          }),
          maxPosts: postData.maxPosts
        }
      }))
      .subscribe(
        (transformedPosts) => {
          console.log(transformedPosts);
          this.posts = transformedPosts.post;
          this.postUpdated.next({ post: [...this.posts], postCount: transformedPosts.maxPosts });
        });
  }

  getPosts() {
    return this.postUpdated.asObservable();
  }

  gettoken() {
    return this.token;
  }

  getauthStatus() {
    return this.authStataus.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, creator: string }>(BACKEND_URL + id);
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  addPosts(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content, creator: null };
    this.http.post<{ message: string, postId: string }>(BACKEND_URL, post)
      .subscribe((res) => {
        console.log(res.message);
        const postId = res.postId;
        post.id = postId;
        this.posts.push(post);
        this.postUpdated.next({ post: [...this.posts], postCount: null });
        this.router.navigate(['/',]);
      });
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = { id: postId, title: title, content: content, creator: null };
    this.http.put(BACKEND_URL + postId, post)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/',]);
      })
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

  createUser(email: string, password: string) {
    const userData: User = { email: email, password: password };
    return this.http.post(BACKENDUSER_URL + "signUp", userData);
  }

  loginUser(email: string, password: string) {
    const userData: User = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string}>(BACKENDUSER_URL + "login", userData)
      .subscribe((res) => {
        this.token = res.token;
        if (this.token) {
          const expiresIn = res.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logOut();
          }, expiresIn * 1000);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.authStataus.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      })
  }

  logOut() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStataus.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
