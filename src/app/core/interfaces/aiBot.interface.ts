export interface IBookSuggestion {
  bookId: number;
  title: string;
  author: string;
  reason: string;
}

export interface IAiAgentRequest {
  message: string;
  conversationId?: string;
}

export interface IAiAgentResponse {
  reply: string;
  suggestions: IBookSuggestion[];
}

export interface IChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  suggestions?: IBookSuggestion[];
  createdAt: Date;
}