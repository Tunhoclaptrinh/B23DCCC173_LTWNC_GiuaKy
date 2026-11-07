import { BOOK_SEEDS } from '../../api/booksApi';
import { borrowBook, fetchBooks, returnBook } from '../../features/books/booksSlice';
import { countBorrowed } from '../../features/books/types';
import { createAppStore } from '../store';

function loadedStore() {
  const store = createAppStore();
  store.dispatch(
    fetchBooks.fulfilled(
      BOOK_SEEDS.map((book) => ({ ...book, cover: { ...book.cover } })),
      'load',
      false,
    ),
  );
  return store;
}

describe('borrow limit middleware with the actual Redux store', () => {
  test('allows three loans and blocks a fourth while displaying a warning', () => {
    const store = loadedStore();
    for (const id of ['clean-code', 'psychology-money', 'english-grammar'])
      store.dispatch(borrowBook(id));
    expect(countBorrowed(store.getState().books.borrowed)).toBe(3);
    const before = store.getState().books;
    store.dispatch(borrowBook('pragmatic-programmer'));
    const after = store.getState().books;
    expect(after.borrowed).toEqual(before.borrowed);
    expect(after.items).toEqual(before.items);
    expect(after.notice).toEqual({
      type: 'warning',
      message: expect.stringContaining('tối đa 3 cuốn'),
    });
  });
  test('counts copies, including repeated borrowing of the same title', () => {
    const store = loadedStore();
    for (let copy = 0; copy < 4; copy += 1) store.dispatch(borrowBook('clean-code'));
    expect(store.getState().books.borrowed).toEqual([{ bookId: 'clean-code', quantity: 3 }]);
    expect(store.getState().books.items[0].availableCopies).toBe(2);
  });
  test('allows borrowing again after returning a copy', () => {
    const store = loadedStore();
    for (let copy = 0; copy < 3; copy += 1) store.dispatch(borrowBook('clean-code'));
    store.dispatch(returnBook('clean-code'));
    store.dispatch(borrowBook('psychology-money'));
    expect(countBorrowed(store.getState().books.borrowed)).toBe(3);
    expect(store.getState().books.borrowed).toContainEqual({
      bookId: 'psychology-money',
      quantity: 1,
    });
    expect(store.getState().books.notice?.type).toBe('success');
  });
});
