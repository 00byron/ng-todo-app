import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TaskService } from 'src/app/api-layer/data.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  public itemsLeft: any;

  private _tasksSubject: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
  public tasks$ = this._tasksSubject.asObservable();

  private _subscriptions: Subscription[] = [];

  constructor(
    private _taskService: TaskService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // fetch the default values for the list
    // if this was connected to a DB then we could do an HTTP request here too
    this.fetchDefaultTasks();
  }

  ngOnDestroy(): void {
    // clear all data subscription when component is destroyed
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  private fetchDefaultTasks(): void {
    // communicate with the data-layer service that we want the default list of tasks
    const getDefaultTaskListSub = this._taskService.getDefaultList().subscribe(data => {
      this._tasksSubject.next(data);
    }, error => {
      this._snackBar.open('Oops! Something Went wrong. Please try again.', 'Dismiss');
    });
    this._subscriptions.push(getDefaultTaskListSub);
  }

}
