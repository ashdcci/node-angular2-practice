import { Routes, RouterModule } from '@angular/router';

import {AppComponent} from './app.component'
import {TasksComponent} from './components/tasks/tasks.component'
import {SimpleDemoComponent} from './components/upload/file.component'

 const appRoutes: Routes = [
    { path: '', component: TasksComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'upload', component: SimpleDemoComponent }
];

export const routing = RouterModule.forRoot(appRoutes);