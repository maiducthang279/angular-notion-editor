import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public html = '';
  tagControl = new FormControl('p');

  public handleChange(html: any) {
    this.html = html;
  }
}
