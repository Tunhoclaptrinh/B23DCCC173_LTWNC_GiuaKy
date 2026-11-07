import { BOOK_SEEDS } from '../../api/booksApi';
import { createAppStore } from '../../app/store';
import { borrowBook, fetchBooks, returnBook, setNotice } from './booksSlice';
import {
  selectAvailableCount,
  selectBooksById,
  selectBorrowedBooks,
  selectBorrowedCount,
  selectBorrowedEntries,
  selectCategoryStats,
  selectLoanQuantities,
} from './selectors';

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

describe('memoized library selectors', () => {
  test('counts titles separately from copies and updates statistics after borrowing and returning', () => {
    const store = loadedStore();
    store.dispatch(borrowBook('clean-code'));
    store.dispatch(borrowBook('clean-code'));
    store.dispatch(borrowBook('psychology-money'));
    const state = store.getState();
    expect(selectBorrowedCount(state)).toBe(3);
    expect(selectBorrowedBooks(state).map((book) => book.id)).toEqual([
      'clean-code',
      'psychology-money',
    ]);
    expect(selectBorrowedEntries(state).map(({ quantity }) => quantity)).toEqual([2, 1]);
    expect(selectLoanQuantities(state).get('clean-code')).toBe(2);
    expect(selectBooksById(state).get('clean-code')?.availableCopies).toBe(3);
    expect(selectAvailableCount(state)).toBe(28);
    expect(selectCategoryStats(state)).toEqual([
      { category: 'CNTT', titles: 6, available: 18, borrowed: 2 },
      { category: 'Kinh tế', titles: 3, available: 4, borrowed: 1 },
      { category: 'Ngoại ngữ', titles: 3, available: 6, borrowed: 0 },
    ]);
    store.dispatch(returnBook('clean-code'));
    expect(selectBorrowedCount(store.getState())).toBe(2);
    expect(selectAvailableCount(store.getState())).toBe(29);
  });

  test('notice-only updates preserve cached maps, borrowed entries and statistics', () => {
    const store = loadedStore();
    store.dispatch(borrowBook('clean-code'));
    const before = store.getState();
    const lookups = selectBooksById(before);
    const entries = selectBorrowedEntries(before);
    const stats = selectCategoryStats(before);
    const quantities = selectLoanQuantities(before);
    store.dispatch(setNotice({ type: 'warning', message: 'Test notification' }));
    const after = store.getState();
    expect(selectBooksById(after)).toBe(lookups);
    expect(selectBorrowedEntries(after)).toBe(entries);
    expect(selectCategoryStats(after)).toBe(stats);
    expect(selectLoanQuantities(after)).toBe(quantities);
  });
});
