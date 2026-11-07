import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { CATEGORIES, countBorrowed, type Category } from './types';

export const selectBooks = (state: RootState) => state.books.items;
export const selectLoans = (state: RootState) => state.books.borrowed;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectLibraryNotice = (state: RootState) => state.books.notice;

export const selectBooksById = createSelector(
  [selectBooks],
  (books) => new Map(books.map((book) => [book.id, book])),
);

export const selectLoanQuantities = createSelector(
  [selectLoans],
  (loans) => new Map(loans.map((loan) => [loan.bookId, loan.quantity])),
);

export const selectBorrowedCount = createSelector([selectLoans], countBorrowed);

export const selectBorrowedEntries = createSelector(
  [selectBooksById, selectLoans],
  (booksById, loans) =>
    loans.flatMap((loan) => {
      const book = booksById.get(loan.bookId);
      return book ? [{ book, quantity: loan.quantity }] : [];
    }),
);

export const selectBorrowedBooks = createSelector([selectBorrowedEntries], (entries) =>
  entries.map(({ book }) => book),
);

export const selectAvailableCount = createSelector([selectBooks], (books) =>
  books.reduce((total, book) => total + book.availableCopies, 0),
);

export interface CategoryStat {
  category: Category;
  titles: number;
  available: number;
  borrowed: number;
}

export const selectCategoryStats = createSelector(
  [selectBooks, selectLoanQuantities],
  (books, quantities): CategoryStat[] => {
    const totals = new Map(
      CATEGORIES.map((category) => [
        category,
        {
          category,
          titles: 0,
          available: 0,
          borrowed: 0,
        },
      ]),
    );
    for (const book of books) {
      const row = totals.get(book.category);
      if (row) {
        row.titles += 1;
        row.available += book.availableCopies;
        row.borrowed += quantities.get(book.id) ?? 0;
      }
    }
    return Array.from(totals.values());
  },
);
