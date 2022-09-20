import { Component, Input, OnInit } from '@angular/core';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() taskData: ITask;
  public isComplete: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.configureData();
  }

  public removeItem(): void {

  }

  public markAsComplete(): void {

  }

  private configureData(): void {
    this.isComplete = this.taskData.isComplete;
  }

}
