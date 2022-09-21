import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskService } from 'src/app/api-layer/data.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() taskData: ITask;
  @Output() taskRemoved: EventEmitter<ITask[]> = new EventEmitter<ITask[]>();
  public isComplete: boolean = false;

  constructor(private _taskService: TaskService) { }

  ngOnInit(): void {
    this.configureData();
  }

  public removeItem(): void {
    const removeTaskSub = this._taskService.removeTask(this.taskData).subscribe(resp => {
      this.taskRemoved.emit(resp);

    }, error => {

    });
  }

  public markAsComplete(): void {
    this.taskData.isComplete = true;

  }

  private configureData(): void {
    this.isComplete = this.taskData.isComplete;
    this._taskService.markAsComplete(this.taskData);
  }

}
