import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TaskService } from 'src/app/api-layer/data.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  @Input() updatedTasks: Observable<ITask[]> = of([]);
  private _tasksSubject: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
  public tasks$ = this._tasksSubject.asObservable();

  private _itemsLeft: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public itemsLeft$ = this._itemsLeft.asObservable();

  private _subscriptions: Subscription[] = [];

  constructor(
    private _taskService: TaskService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const updatedTasksSub = this.updatedTasks.subscribe(val => {
      if (val.length > 0) this.updateTasks();
    });
    // fetch the default values for the list
    // if this was connected to a DB then we could do an HTTP request here too
    this.fetchDefaultTasks();
    this.fetchAllTasks();

    this._subscriptions.push(updatedTasksSub);
  }

  ngOnDestroy(): void {
    // clear all data subscription when component is destroyed
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public updateList(event: any): void {
    this._tasksSubject.next(event);
    this.calculateItemsLeft(event);
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

  private fetchAllTasks(): void {
    // I wanted to make these separate to show the power in having two types of calls
    // if we had a dataset that was predetermined, then we can add to the list with this call

    const getAllTasksSub = this._taskService.getAllTasks(this._tasksSubject.getValue()).subscribe(data => {
      this._tasksSubject.next(data);

      this.calculateItemsLeft(data);
    }, error => {
      this._snackBar.open('Oops! Something Went wrong. Please try again.', 'Dismiss');
    });
    this._subscriptions.push(getAllTasksSub);
  }

  private updateTasks(): void{
    const updatedTasksSub = this.updatedTasks.subscribe(taskList => {
      this._tasksSubject.next(taskList);
      this.calculateItemsLeft(taskList);
    });

    this._subscriptions.push(updatedTasksSub);
  }

  private calculateItemsLeft(data: ITask[]): void {
    let tempString;
    const unCompleteTasks = data.filter(d => !d.isComplete);

    if (unCompleteTasks.length > 1) tempString = `${unCompleteTasks.length} items left`;
    else tempString = `${unCompleteTasks.length} item left`;

    this._itemsLeft.next(tempString);
  }

}
