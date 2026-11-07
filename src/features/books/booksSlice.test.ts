import { BOOK_SEEDS } from '../../api/booksApi';
import reducer, {
  borrowBook,
  clearNotice,
  fetchBooks,
  initialBooksState,
  returnBook,
  setNotice,
} from './booksSlice';
import type { Book, BooksState } from './types';

const fixtures = (): Book[] => BOOK_SEEDS.map((book) => ({ ...book, cover: { ...book.cover } }));
const loaded = (): BooksState =>
  reducer(undefined, fetchBooks.fulfilled(fixtures(), 'request-1', false));

describe('booksSlice reducer', () => {
  test('provides the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialBooksState);
  });
  test('pending shows loading and clears a previous error', () => {
    const state = reducer(
      { ...initialBooksState, status: 'failed', error: 'old error' },
      fetchBooks.pending('request-1', false),
    );
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });
  test('fulfilled stores the catalogue', () => {
    expect(loaded().status).toBe('succeeded');
    expect(loaded().items).toEqual(fixtures());
  });
  test('rejected stores the API error', () => {
    const state = reducer(
      undefined,
      fetchBooks.rejected(null, 'request-1', true, 'Không thể tải sách'),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Không thể tải sách');
  });
  test('unexpected rejection has a useful fallback error', () => {
    expect(
      reducer(undefined, fetchBooks.rejected(new Error('network'), 'request-1', false)).error,
    ).toMatch('Có lỗi xảy ra');
  });
  test('borrowing decreases availability and adds a loan without mutating the previous state', () => {
    const before = loaded();
    const after = reducer(before, borrowBook('clean-code'));
    expect(after.items[0].availableCopies).toBe(4);
    expect(after.borrowed).toEqual([{ bookId: 'clean-code', quantity: 1 }]);
    expect(before.items[0].availableCopies).toBe(5);
    expect(before.borrowed).toEqual([]);
  });
  test('borrowing a second copy increases the quantity for the same title', () => {
    const state = reducer(reducer(loaded(), borrowBook('clean-code')), borrowBook('clean-code'));
    expect(state.borrowed).toEqual([{ bookId: 'clean-code', quantity: 2 }]);
    expect(state.items[0].availableCopies).toBe(3);
  });
  test('out-of-stock and unknown titles cannot be borrowed', () => {
    const before = loaded();
    expect(reducer(before, borrowBook('thinking-fast-slow'))).toEqual(before);
    expect(reducer(before, borrowBook('missing-id'))).toEqual(before);
  });
  test('returning the final copy restores availability and removes the loan', () => {
    const state = reducer(reducer(loaded(), borrowBook('clean-code')), returnBook('clean-code'));
    expect(state.items[0].availableCopies).toBe(5);
    expect(state.borrowed).toEqual([]);
  });
  test('returning one of several copies preserves the remaining loan', () => {
    let state = reducer(loaded(), borrowBook('clean-code'));
    state = reducer(state, borrowBook('clean-code'));
    state = reducer(state, returnBook('clean-code'));
    expect(state.borrowed).toEqual([{ bookId: 'clean-code', quantity: 1 }]);
    expect(state.items[0].availableCopies).toBe(4);
  });
  test('returning an unborrowed or unknown book cannot create stock', () => {
    const before = loaded();
    expect(reducer(before, returnBook('clean-code'))).toEqual(before);
    expect(reducer(before, returnBook('missing-id'))).toEqual(before);
  });
  test('refreshing the catalogue preserves availability for existing loans', () => {
    const borrowed = reducer(loaded(), borrowBook('clean-code'));
    const state = reducer(borrowed, fetchBooks.fulfilled(fixtures(), 'request-2', false));
    expect(state.items[0].availableCopies).toBe(4);
    expect(state.borrowed).toEqual(borrowed.borrowed);
  });
  test('a warning can be set and dismissed', () => {
    const notice = { type: 'warning' as const, message: 'Đã đủ 3 cuốn' };
    const state = reducer(loaded(), setNotice(notice));
    expect(state.notice).toEqual(notice);
    expect(reducer(state, clearNotice()).notice).toBeNull();
  });
});
