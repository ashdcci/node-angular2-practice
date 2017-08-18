import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'
import {Headers} from '@angular/http'

@Injectable()
export class TaskService{
	constructor(private http:Http){
		console.log('Task Service initialised...')
	}

	getTasks(){
		return this.http.get('/api/tasks/tasks')
				.map(res => res.json())
	}

	addTask(newTask){
	console.log(newTask,JSON.stringify(newTask))
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/tasks/task', newTask, {headers: headers})
            .map(res => res.json());
    }

    deleteTask(id){
    	return this.http.delete('/api/tasks/task/'+id).map(res=> res.json())
    }
}
