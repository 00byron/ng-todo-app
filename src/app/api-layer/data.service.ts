import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ITask } from "../interfaces/task.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _defaultList: ITask[] = [];
  private _allTasks: ITask[] = [];

  constructor() { }

  public getDefaultList(): Observable<ITask[]> {
    // get the default list of tasks - acts like a local db
    // if there are no tasks set, then we do not need to call this method
    this._defaultList = [
      { id: 0, taskDetails: 'Do some work', isComplete: true }
    ];
    // return the dataset as the type of observable to subscribe to async later
    return of(this._defaultList);
  }

  public getAllTasks(taskList?: ITask[]): Observable<ITask[]> {
    // collect all the tasks, including the default tasks
    this._allTasks = this._defaultList;

    if (taskList && taskList.length !== 0) {
      // check if the task list passed in has entries
      taskList.forEach(task => {
        // confirm that each item is not included in the default list
        // then push it into a new dataset
        if (!this._defaultList.includes(task)) this._allTasks.push(task);
      });
    }
    // return the dataset as the type of observable to subscribe to async later
    return of(this._allTasks);
  }

  public addTask(task: ITask): Observable<ITask[]> {
    // add a new task to the dataset
    this._allTasks.push(task);

    // return the dataset as the type of observable to subscribe to async later
    return of(this._allTasks);
  }

  public markAsComplete(task: ITask): Observable<ITask[]> {
    // find the selected item in the dataset
    const selectedItemIndex = this._allTasks.findIndex(x => x.id === task.id);

    // mark the selected task as completed
    this._allTasks[selectedItemIndex].isComplete = true;
    // return the dataset as the type of observable to subscribe to async later
    return of(this._allTasks);
  }

  public getNewId(): Observable<number> {
    // return the dataset as the type of observable to subscribe to async later
    return of(this._allTasks.length);
  }

  public removeTask(task: ITask): Observable<ITask[]> {
    const selectedItemIndex = this._allTasks.findIndex(x => x.id !== task.id);

    // remove the selected task
    const newArr = this._allTasks.slice(selectedItemIndex);

    // return the dataset as the type of observable to subscribe to async later
    return of(newArr);
  }
}
