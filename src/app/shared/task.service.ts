import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from './item.interface';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  //Get all tasks for a specific employee
  getTasks(empID: number){
    return this.http.get('/api/employees/' + empID + '/tasks')
  }

  // Add a new task to a specific employee
  addTask(empID: number, text: string){
    return this.http.post('/api/employees/' + empID + '/tasks', { text })
  }

  deleteTask(empID: number, taskID: string){
    console.log('/api/employees/' + empID + '/tasks/' + taskID)
    return this.http.delete('/api/employees/' + empID + '/tasks/' + taskID)
  }

  updateTask(empId: number, todo: Item[], done: Item[]) {
    return this.http.put('/api/employees/' + empId + '/tasks', {
      todo,
      done
    })
  }
}
