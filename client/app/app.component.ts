import { Component } from '@angular/core'
import {TaskService} from './services/task.service'
import {PostService} from './services/post.service'
@Component({
	moduleId: module.id,
	selector: 'my-app',
	templateUrl: 'app.component.html',
	providers:[TaskService, PostService],

})

export class AppComponent { }
