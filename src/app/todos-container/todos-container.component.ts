import { Component, OnInit, Input } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { catchError, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { throwError } from 'rxjs';
import { TodoInfos } from '../models/todo';

@Component({
  selector: 'app-todos-container',
  templateUrl: './todos-container.component.html',
  styleUrls: ['./todos-container.component.scss'],
})
export class TodosContainerComponent implements OnInit {
  todos: TodoInfos[] = [];
  todosData: TodoInfos[] = [];
  selectedOptions: any = [];

  constructor(private todoservice: TodoService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getTodos();
  }

  openDialog(array:[]): void {
    if (array.length > 0) {
      const dialogRef = this.dialog.open(DialogBoxComponent, {
        data: { data: array },
      });
      dialogRef.afterClosed().subscribe((result) => {
        result.data.forEach((values:any)=>{
          console.log(values)
          this.updateTodo(values.id,values.name)
        })
      });
    } else {
      const dialogRef = this.dialog.open(DialogBoxComponent, {
        data: { name: '' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.todosData = [result.data];
        this.postTodo(result.data);
      });
    }
  }
  onAreaListControlChanged(list: any): void {
    this.selectedOptions = list.selectedOptions.selected.map(
      (item: any) => item.value
    );
    console.log('Selected => ', this.selectedOptions);
  }
  deleteAllSelectedTodos(todosArray: any): void {
    [todosArray] = todosArray;
    todosArray.forEach((todoId: any) => this.deleteTodo(parseInt(todoId.id)));
  }
  /* API Functions */
  getTodos() {
    try {
      this.todoservice
        .getTodos()
        .pipe(
          map((Todo: any) => {
            return Todo;
          })
        )
        .subscribe((data) => {
          this.todos = data.data.todo;
          console.log('GET_ALL =>', this.todos);
        });
    } catch (err) {
      console.log('GET_ALL_ERR => err', err);
    }
  }
  postTodo(name: string) {
    this.todoservice
      .postTodo(name)
      .pipe(
        tap((data) => console.log(data.data.create.name)),
        catchError((error) => (console.log(error), throwError(error)))
      )
      .subscribe(() => this.getTodos());
  }
  deleteTodo(id: number) {
    this.todoservice
      .deleteTodo(id)
      .pipe(
        tap((data) => console.log(data)),
        catchError((error) => (console.log(error), throwError(error)))
      )
      .subscribe(() => this.getTodos());
  }
  updateTodo(id: number, name: string) {
    this.todoservice
      .updateTodo(id, name)
      .pipe(
        tap((data) => console.log(data)),
        catchError((error) => (console.log(error), throwError(error)))
      )
      .subscribe(() => this.getTodos());
  }
}
