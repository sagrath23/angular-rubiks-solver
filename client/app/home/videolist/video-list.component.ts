import { Component , Input , OnInit }   from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { Location }                     from '@angular/common';

import { User } from '../auth/user';
import { Video } from '../videoplayer/video';

import { AuthService } from '../auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'my-videos',
  templateUrl: 'video-list.component.html',
  providers: [AuthService]
})

export class VideoListComponent implements OnInit {

  @Input()
  loggedUser: User;

	videos: Video[];

	selectedVideo: Video;

	title = 'Video List';

  constructor(private authService: AuthService,
		private route: ActivatedRoute,
		private location: Location) {}

	ngOnInit(): void {

		this.getVideos();
  }

  getVideos(): void {
    this.authService.getVideos('testSessionId').then(videos => this.videos = videos);
  }
}
