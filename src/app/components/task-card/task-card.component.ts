import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/app/api-layer/data.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, OnDestroy {
  @Input() taskData: ITask;
  @Output() taskRemoved: EventEmitter<ITask[]> = new EventEmitter<ITask[]>();
  public isComplete: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _taskService: TaskService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.configureData();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public removeItem(): void {
    const removeTaskSub = this._taskService.removeTask(this.taskData).subscribe(resp => {
      this.taskRemoved.emit(resp);
      this._snackBar.open('Task Removed Successfully!', 'Ok');
    }, error => {
      this._snackBar.open('Oops! Something Went wrong. Please try again.', 'Dismiss');
    });

    this._subscriptions.push(removeTaskSub);
  }

  public markAsComplete(event?: any): void {
    if (event) {
      this.taskData.isComplete = true;
      const markCompleteSub = this._taskService.markAsComplete(this.taskData).subscribe(resp => {
        this._taskService.updateItemsLeft(resp);
        this._snackBar.open('Yes! Another One Done!', 'Cool!');
      }, error => {
        this._snackBar.open('Oops! Something Went wrong. Please try again.', 'Dismiss');
      });
      this._subscriptions.push(markCompleteSub);
    } else return;
  }

  private configureData(): void {
    this.isComplete = this.taskData.isComplete;
    this._taskService.markAsComplete(this.taskData);
  }

}
