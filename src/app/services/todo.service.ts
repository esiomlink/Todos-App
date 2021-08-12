import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';

const GET_ALL_TODOS = gql`
  query {
    todo {
      id
      name
    }
  }
`;
const POST_TODO = gql`
  mutation create($name: String!) {
    create(input: { name: $name }) {
      id
      name
    }
  }
`;
const DELETE_TODO = gql`
  mutation deleteTodo($id: Int!) {
    deleteTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $name: String!) {
    updateTodo(input: { id: $id, name: $name  }) {
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private apollo: Apollo) {}

  getTodos(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_TODOS,
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  postTodo(name: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: POST_TODO,
      variables: {
        name: name,
      },
    });
  }

  deleteTodo(id: number): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: DELETE_TODO,
      fetchPolicy: 'no-cache',
      variables: { id: id },
    });
  }

  updateTodo(id: number, name: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: UPDATE_TODO,
      fetchPolicy: 'no-cache',
      variables: { id: id, name: name },
    });
  }
}
