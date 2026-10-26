import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { AiBot } from '../../ai-bot/ai-bot';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Header, Footer, AiBot],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}
