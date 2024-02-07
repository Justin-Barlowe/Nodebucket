//Name: Justin Barlowe
//File: tasks.component.ts
//Date: 01/18/2024
//Description: Tasks component

import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from '../shared/task.service';
import { Employee } from '../shared/employee.interface';
import { Item } from '../shared/item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  employee: Employee;
  empId: number;
  todo: Item[];
  done: Item[];
  errorMessage: string;
  successMessage: string;

  newTaskForm: FormGroup = this.fb.group({
    text: [null, Validators.compose ([ Validators.required, Validators.minLength(3), Validators.maxLength(50)])]
  });

  constructor(private cookieService: CookieService, private taskService: TaskService, private fb: FormBuilder) {
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    this.errorMessage = '';
    this.successMessage = '';

    this.empId = parseInt(this.cookieService.get('session_user'), 10);

      //
    this.taskService.getTasks(this.empId).subscribe({
      next: (res: any) => {
        console.log('Employee: ', res);
        this.employee = res;
      },
      error: (err) => {
        console.error('error: ', err);
        this.errorMessage = err.message;
        this.hideAlert();
      },
      complete: () => {
        if (this.employee.todo) {
          this.todo = this.employee.todo;
        } else {
          this.todo = [];
        }
        if (this.employee.done) {
          this.done = this.employee.done;
        } else {
          this.done = [];
        }

      }
   });
  }

  // Add task to todo list
  addTask() {
    const text = this.newTaskForm.controls['text']?.value;

    this.taskService.addTask(this.empId, text).subscribe({
      next: (task: any) => {
        console.log('Task added: ', task);
        this.successMessage = 'Task added successfully';
        const newTask = {
          _id: task._id,
          text: text
        }

        this.todo.push(newTask);
        this.newTaskForm.reset();

        this.hideAlert();

      },
      error: (err) => {
        console.log('Error: ', err);
        this.errorMessage = 'Unable to add task';
        this.hideAlert();
      }
  });
  }

  // Delete task from list
  deleteTask(taskId: string) {
    console.log('Task item: ${taskId}');

    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(this.empId, taskId).subscribe({
      next: (res: any) => {
        console.log('Task deleted successfully');

        if (!this.todo) this.todo = [];
        if (!this.done) this.done = [];

        this.todo = this.todo.filter(t => t._id.toString() !== taskId);
        this.done = this.done.filter(t => t._id.toString() !== taskId);

        this.successMessage = 'Task deleted successfully';

        this.hideAlert();
      },

      error: (err) => {
        console.error('Error: ', err);
        this.errorMessage = 'Unable to delete task';
        this.hideAlert();
      }
    });

  }


  // Drop Event
  drop(event: CdkDragDrop<Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      console.log('Moved item in array', event.container.data);

      this.updateTaskList(this.empId, this.todo, this.done);
    } else {
      transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
      );

      console.log('Moved item to another container', event.container.data);

      this.updateTaskList(this.empId, this.todo, this.done);
    }
  }


  // Hide alert timeout
  hideAlert() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  // Update task list
  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, done).subscribe({
      next: (res: any) => {
        console.log('Task list updated successfully');
      },
      error: (err) => {
        console.error('Error: ', err);
        this.errorMessage = err.message;
        this.hideAlert();
      }
    });
  }
}
