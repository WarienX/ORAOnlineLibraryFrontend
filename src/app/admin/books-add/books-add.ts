import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-books-add',
  imports: [],
  templateUrl: './books-add.html',
  styleUrl: './books-add.scss',
})
export class BooksAdd {
  addBookModel = signal({
    title: '',
    seriesName: '',
    author: '',
    genre: '',
    language: '',
    gradeId: null
  });
  addBookForm = form(this.addBookModel);
}
