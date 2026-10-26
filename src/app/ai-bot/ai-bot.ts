import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AiBotService, StudentService } from '../services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IBookSuggestion, IChatMessage } from '../core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ai-bot',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './ai-bot.html',
  styleUrl: './ai-bot.scss',
})
export class AiBot {
  private aiBotService = inject(AiBotService);

  @ViewChild('chatBody') chatBody?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  isTyping = signal(false);
  messageText = '';
  messages = signal<IChatMessage[]>([]);

  private shouldScroll = false;
  private conversationId = crypto.randomUUID();

  quickActions = [
    'Suggest a book for me',
    'Recommend something fun'
  ];

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleBot() {
    this.isOpen.update((v) => !v);

    // First open → welcome message
    if (this.isOpen() && this.messages().length === 0) {
      this.addBotMessage(
        "Hi! I'm ORA 📚 Your library buddy. Ask me for book ideas or just say hello!"
      );
    }
  }

  sendMessage(text?: string) {
    const content = (text ?? this.messageText).trim();
    if (!content || this.isTyping()) return;

    this.addUserMessage(content);
    this.messageText = '';
    this.isTyping.set(true);
    this.shouldScroll = true;

    this.aiBotService.sendMessage(content, this.conversationId).subscribe({
      next: (res) => {
        this.isTyping.set(false);
        this.addBotMessage(res.reply, res.suggestions || []);
      },
      error: () => {
        this.isTyping.set(false);
        this.addBotMessage(
          "Sorry, I couldn't respond right now. Please try again."
        );
      }
    });
  }

  onQuickAction(action: string) {
    this.sendMessage(action);
  }

  private addUserMessage(text: string) {
    this.messages.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        role: 'user',
        text,
        createdAt: new Date()
      }
    ]);
    this.shouldScroll = true;
  }

  private addBotMessage(text: string, suggestions: IBookSuggestion[] = []) {
    this.messages.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        role: 'bot',
        text,
        suggestions,
        createdAt: new Date()
      }
    ]);
    this.shouldScroll = true;
  }

  private scrollToBottom() {
    const el = this.chatBody?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
