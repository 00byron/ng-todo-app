import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ITask } from "../interfaces/task.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _defaultList: ITask[] = [];
  private _allTasks: ITask[] = [];

  private _tasksSubject: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
  public tasks$ = this._tasksSubject.asObservable();

  // can use the observable variable from the service - but these are not always a great idea to use.
  // I put these here in case we might want to use them at some point
  private _tasksLeftSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public tasksLeft$ = this._tasksLeftSubject.asObservable();

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
    this._tasksSubject.next(this._allTasks);
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

  public updateItemsLeft(data?: ITask[]): Observable<any> {
    const listOfItems = data ? data : this._tasksSubject.getValue();

    let tempString;
    const unCompleteTasks = listOfItems.filter(d => !d.isComplete);

    if (unCompleteTasks.length !== 1) tempString = `${unCompleteTasks.length} items left`;
    else tempString = `${unCompleteTasks.length} item left`;

    this._tasksLeftSubject.next(tempString);

    return of(tempString);
  }

  public removeTask(task: ITask): Observable<ITask[]> {
    const selectedItemIndex = this._allTasks.findIndex(x => x.id !== task.id);

    // remove the selected task
    const newArr = this._allTasks.slice(selectedItemIndex, 1);
    this._tasksSubject.next(newArr);

    // return the dataset as the type of observable to subscribe to async later
    return of(newArr);
  }
}
