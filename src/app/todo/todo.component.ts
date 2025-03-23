import { Component, OnInit } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import Toastify from 'toastify-js'; 

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [NgFor, CommonModule],
  template: `
    <div class="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-4xl font-semibold text-center text-blue-600 mb-6">To-Do List</h1>

      <div class="flex gap-4 mb-6">
        <input #newTodo type="text" placeholder="Add a new task" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button (click)="addTodo(newTodo)" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
          Add
        </button>
      </div>

      <div class="flex justify-between mb-4">
        <button (click)="clearCompleted()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Clear Completed</button>
        <button (click)="clearAll()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Clear All
        </button>
      </div>

      <ul>
        <li *ngFor="let todo of todos; let i = index" class="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200">
          <div class="flex items-center">
            <input type="checkbox" [checked]="todo.completed" (change)="toggleCompletion(i)" class="mr-4 h-5 w-5 text-blue-500 rounded"/>
            <span [class.text-gray-400]="todo.completed" class="flex-1">{{ todo.text }}</span>
          </div>
          <div class="flex gap-2">
            <button (click)="editTodo(i)" class="px-4 py-1 text-yellow-500 hover:text-yellow-600">Edit</button>
            <button (click)="removeTodo(i)" class="px-4 py-1 text-red-500 hover:text-red-600">Remove</button>
          </div>
        </li>
      </ul>

      <p *ngIf="todos.length > 0" class="text-right text-sm text-gray-600 mt-4">
        Tasks left: {{ tasksLeft }}
      </p>
    </div>
  `,
  styles: []
})
export class TodoComponent implements OnInit {
  todos: { text: string; completed: boolean }[] = [];

  ngOnInit(): void {
    // Ensure this runs only on the client-side (browser)
    if (typeof window !== 'undefined' && localStorage) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
    }
  }

  // Add new todo
  addTodo(todoInput: HTMLInputElement) {
    const todoText = todoInput.value.trim();
    if (todoText) {
      this.todos.push({ text: todoText, completed: false });
      todoInput.value = ''; // Clear input field after adding
      this.saveTodos();
      this.showToast('Task added successfully!', 'success');
    } else {
      this.showToast('Please enter a task.', 'error');
    }
  }

  // Remove a todo
  removeTodo(index: number) {
    this.todos.splice(index, 1);
    this.saveTodos();
    this.showToast('Task removed successfully!', 'error');
  }

  // Toggle completion state
  toggleCompletion(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
    this.saveTodos();
  }

  // Edit an existing todo
  editTodo(index: number) {
    const newText = prompt('Edit your task:', this.todos[index].text);
    if (newText !== null && newText.trim()) {
      this.todos[index].text = newText.trim();
      this.saveTodos();
      this.showToast('Task updated successfully!', 'success');
    }
  }

  // Clear all tasks
  clearAll() {
    this.todos = [];  // Clear all tasks
    this.saveTodos();
    this.showToast('All tasks cleared!', 'error'); // Show red toast for clearing all tasks
  }

  // Clear completed tasks
  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.saveTodos();
    this.showToast('Completed tasks cleared!', 'error');
  }

  // Save todos to localStorage
  private saveTodos() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }

  // Get the number of tasks left to complete
  get tasksLeft() {
    return this.todos.filter(todo => !todo.completed).length;
  }

  // Show toast notification
  private showToast(message: string, type: 'success' | 'error') {
    Toastify({
      text: message,
      backgroundColor: type === 'success' ? 'green' : '#C74C3C',
      duration: 1000,
      close: true,
      position: 'right',
    }).showToast();
  }
}
