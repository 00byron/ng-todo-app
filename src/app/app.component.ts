import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from './interfaces/task.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'todo-app';
  private _updatedList: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
  public updatedList$ = this._updatedList.asObservable();

  public captureUpdatedList(event: any): void {
    this._updatedList.next(event);
  }
}
