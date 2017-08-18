import { Component } from '@angular/core';
import {PostService} from '../../services/post.service'
import {Task} from '../../../Task'
@Component({
    moduleId: module.id,
    selector: 'posts',
    templateUrl: 'posts.component.html'
})
export class PostsComponent {
  post : Task[]
  title:string
  constructor(private postService:PostService){
		this.postService.getPosts()
			.subscribe(posts => {

        this.post = posts
			})
	}

  deletePost(id){
    console.log(id)
  }

  likePost(id,check){
      this.postService.likePost(id)
        .subscribe(data => {
          console.log(data)
            if(data.n == 1){

            }
        })
  }
}
