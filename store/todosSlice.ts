import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string; // Optional field for timestamp
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload; // Replace the current TODO list with the new one
    },
    addTodos(state, action: PayloadAction<Todo[]>) {
      const baseDate = new Date();
      const todosWithTimestamp = action.payload.map((todo, index) => {
        if (index > 0 && index % 5 === 0) {
          baseDate.setDate(baseDate.getDate() + 1);
        }
        return {
          ...todo,
          created_at: todo.created_at || baseDate.toISOString(), // Ensure created_at exists
        };
      });

      // Filter out duplicates based on the id
      const uniqueTodos = todosWithTimestamp.filter(
        (newTodo) => !state.todos.some((existingTodo) => existingTodo.id === newTodo.id)
      );

      state.todos = [...state.todos, ...uniqueTodos];
    },
    updateTodoStatus(state, action: PayloadAction<{ id: number; completed?: boolean; title?: string }>) {
      const { id, completed, title } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        if (completed !== undefined) {
          todo.completed = completed; // Update the completed status
        }
        if (title !== undefined) {
          todo.title = title; // Update the title
        }
      }
    },
    deleteTodo(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.todos = state.todos.filter((todo) => todo.id !== id); // Remove the TODO with the given ID
    },
  },
});

export const { setTodos, addTodos, updateTodoStatus, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;