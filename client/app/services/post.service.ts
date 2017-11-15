import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'
import {Headers} from '@angular/http'
import { Task } from '../../Task';
import 'rxjs/add/operator/toPromise';
var Post = [];
@Injectable()
export class PostService{
  constructor(private http:Http){
		console.log('Post Service initialised...')
	}

	getPosts(): Promise<Task[]>{
		// return Promise.resolve(this.http.get('/api/posts/fetch-all-post/0')
		// 		.map(res => res.json()))

    return this.http.get('/api/posts/fetch-all-post/0')
             .toPromise()
             .then(response => response.json().data as Task[])
             .catch(this.handleError);
	}

  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
  }

  likePost(id){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/posts/like_post/'+id, {headers: headers})
        .map(res => res.json());
  }
}
