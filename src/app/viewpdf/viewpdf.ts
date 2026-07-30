import { Component, signal } from '@angular/core';
import { DocumentViewerConfig } from "img-pdf-viewer";
import { booksList } from '../seed_data/books_list';
import { ImgPdfViewerModule } from "img-pdf-viewer";

@Component({
  selector: 'app-viewpdf',
  imports: [ImgPdfViewerModule],
  templateUrl: './viewpdf.html',
  styleUrl: './viewpdf.scss',
})
export class Viewpdf {
  booksList = signal(booksList);
  title = signal('View PDF');
  docUrl = signal(booksList[0].url); // Default to the first book's URL

  config: DocumentViewerConfig = {
    showToolbar: true,
    showZoom: true,
    showRotation: true,
    showDownload: true,
    showFullscreen: true,
    initialZoom: 100,
    viewMode: "continuous", // Options: 'single' | 'continuous'
  };

  printDocUrl = () => {
    console.log('Document URL:', this.docUrl()?.toString());
  }
}
