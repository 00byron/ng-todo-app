import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/app/api-layer/data.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  @Output() updatedDataSet: EventEmitter<ITask[]> = new EventEmitter<ITask[]>();
  @ViewChild('taskInputField', {static: true}) taskInputField: ElementRef;
  public task: string = '';

  // manage our data subscriptions to prevent memeroy leaks
  private _subscriptions: Subscription[] = [];

  constructor(private _taskService: TaskService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.taskInputField.nativeElement.focus();
  }

  ngOnDestroy(): void {
    // clear all data subscription when component is destroyed
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public captureInputValue(event?: any): void {
    if (this.task.length === 0) return;
    // the event captured here is the keyup event and is not useful thanks to the ngModel value
    // create a temporary dat value for setting the new task
    let data: ITask;
    // we will use this index to set a new one in consecutive order as the other task items
    let newIndex;

    // link the new index with the length of the dataset
    const indexNumberSub = this._taskService.getNewId().subscribe(id => newIndex = id);

    // set our temporary data for the service call
    data = {
      id: newIndex,
      taskDetails: this.task,
      isComplete: false
    };

    // capture the subscription used for sending the "addTask" request
    // if the response is goo, we notify the UI that things are good.
    const addTaskSub = this._taskService.addTask(data).subscribe(resp => {
      this.task = '';
      this._snackBar.open('Task added Successfully!', 'Ok');
      this._taskService.updateItemsLeft(resp);
      // I was tempted to add an observable to the service class to monitor the list
      // however, with the time constraint, I went this route of emitting the data rather
      this.updatedDataSet.emit(resp);
    }, error => {
      // if there's an error, we notify the UI
      this._snackBar.open('Oops! Something Went wrong. Please try again.', 'Dismiss');
    });

    // clean up our data subscriptions
    this._subscriptions.push(indexNumberSub, addTaskSub);
  }
}
