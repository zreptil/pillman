import {Component} from '@angular/core';
import {UserData} from './_model/user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pillman';

  constructor() {
    const test: UserData = new UserData();
    test.fillFromJson({n: 'zreptil'});
  }
}
