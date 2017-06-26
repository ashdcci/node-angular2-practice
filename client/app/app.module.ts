import { NgModule } from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpModule} from '@angular/http'
import {FormsModule} from '@angular/forms'
import {AppComponent} from './app.component'
import {TasksComponent} from './components/tasks/tasks.component'
import {SimpleDemoComponent} from './components/upload/file.component'
import { routing }        from './app.routes';


@NgModule({
	imports:      [routing, BrowserModule, HttpModule, FormsModule ],
	declarations: [AppComponent, TasksComponent, SimpleDemoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }