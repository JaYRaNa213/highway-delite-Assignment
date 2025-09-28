export interface User {
  _id: string;
  email: string;
  name: string;
  signupMethod: 'email' | 'google';
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data?: {
    notes: Note[];
  };
}

export interface NoteResponse {
  success: boolean;
  message: string;
  data?: {
    note: Note;
  };
}

export interface ApiError {
  success: false;
  message: string;
}
