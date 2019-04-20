import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  userisAuthenticated = false;

  constructor(private authService: PostService) { }

  ngOnInit() {
    this.authListenerSub = this.authService.getauthStatus().subscribe(isAuthenticated => {
      this.userisAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogOut() {
    this.authService.logOut();
  }

}
