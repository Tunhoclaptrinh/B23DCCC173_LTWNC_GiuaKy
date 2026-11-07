export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;
export type Category = (typeof CATEGORIES)[number];
export type CategoryFilter = Category | 'all';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  cover: {
    background: string;
    foreground: string;
    motif: 'code' | 'rings' | 'grid' | 'type' | 'steps' | 'orbit';
    label: string;
    title: string;
  };
}

export interface BorrowedBook {
  bookId: Book['id'];
  quantity: number;
}

export interface LibraryNotice {
  type: 'success' | 'warning';
  message: string;
}

export interface BooksState {
  items: Book[];
  borrowed: BorrowedBook[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  notice: LibraryNotice | null;
}

export const BORROW_LIMIT = 3;
export const countBorrowed = (borrowed: readonly BorrowedBook[]): number =>
  borrowed.reduce((total, loan) => total + loan.quantity, 0);
