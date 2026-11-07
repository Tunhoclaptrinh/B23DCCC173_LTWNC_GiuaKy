import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setNotice } from '../../features/books/booksSlice';
import { BORROW_LIMIT, countBorrowed, type BooksState } from '../../features/books/types';

/** Enforce the rule at the store boundary, including non-UI dispatches. */
export const borrowLimitMiddleware: Middleware<object, { books: BooksState }> =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    if (borrowBook.match(action) && countBorrowed(getState().books.borrowed) >= BORROW_LIMIT) {
      dispatch(
        setNotice({
          type: 'warning',
          message:
            'Bạn chỉ được mượn tối đa 3 cuốn cùng lúc. Hãy trả một cuốn trước khi mượn thêm.',
        }),
      );
      return; // Deliberately do not forward the borrowing action to the reducer.
    }
    return next(action);
  };
