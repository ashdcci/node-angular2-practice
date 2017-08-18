import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'
import {Headers} from '@angular/http'

@Injectable()
export class PostService{
  constructor(private http:Http){
		console.log('Post Service initialised...')
	}

	getPosts(){
		return this.http.get('/api/posts/fetch-all-post/0')
				.map(res => res.json())
	}

  likePost(id){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/posts/like_post/'+id, {headers: headers})
        .map(res => res.json());
  }
}
