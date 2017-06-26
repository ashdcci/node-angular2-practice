import { Component } from '@angular/core';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  moduleId: module.id,
  selector: 'simple-demo',
  templateUrl: './upload.component.html'
})
export class SimpleDemoComponent {
  onChange(event) {
    var files = event.srcElement.files;
    console.log(files);
  }
}