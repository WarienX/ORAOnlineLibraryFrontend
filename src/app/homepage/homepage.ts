import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {
  protected readonly title = signal('ORA Reading Collective');
  booksList = signal([
    {
      title: 'The Great Gatsby'
    }
  ])

  addBooksToList(data: { title: string }[]) {
    this.booksList.update((current) => [...current, ...data]);
  }
}
