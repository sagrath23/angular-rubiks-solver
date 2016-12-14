import { Component , Input , OnInit }   from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { Location }                     from '@angular/common';

import 'rxjs/add/operator/switchMap';

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
  sessionId: string;

	videos: Video[];

	selectedVideo: Video;

	title = 'Video List';

  constructor(private authService: AuthService,
		private route: ActivatedRoute,
		private location: Location) {}

	ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
      this.getVideos();
    });
  }

  getVideos(): void {
    this.authService.getVideos(this.sessionId).then(videos => this.videos = videos);
  }
}
