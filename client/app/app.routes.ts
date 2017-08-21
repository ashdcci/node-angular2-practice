import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {AppComponent} from './app.component'
import {TasksComponent} from './components/tasks/tasks.component'
import {PostsComponent} from './components/posts/posts.component'
import {SimpleDemoComponent} from './components/upload/file.component'

 const appRoutes: Routes = [
    { path: '', component: TasksComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'posts', component: PostsComponent },
    { path: 'upload', component: SimpleDemoComponent }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
