export interface Exam {
  id: string;
  title: string;
  specialty: string;
  questionsCount: number;
  durationMinutes: number;
  participantsCount?: number;
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  views: number;
  category: string;
  thumbnailUrl?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  category: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  type: 'print' | 'ebook';
  coverUrl?: string;
}

export interface Seminar {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  description?: string;
}
