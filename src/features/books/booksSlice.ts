import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksApi } from '../../api/booksApi';
import { isApiSuccess } from '../../api/types';
import type { Book, BooksState, LibraryNotice } from './types';

export const initialBooksState: BooksState = {
  items: [],
  borrowed: [],
  status: 'idle',
  error: null,
  notice: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],
  boolean | undefined,
  { state: { books: BooksState }; rejectValue: string }
>(
  'books/fetchBooks',
  async (shouldFail, { rejectWithValue }) => {
    const response = await fetchBooksApi(shouldFail);
    if (isApiSuccess(response)) return response.data;
    return rejectWithValue(response.error);
  },
  // React StrictMode mounts effects twice; only one request should be in flight.
  {
    condition: (_, { getState }) => {
      const status = getState().books.status;
      return status === 'idle' || status === 'failed';
    },
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    borrowBook(state, action: PayloadAction<Book['id']>) {
      const book = state.items.find((item) => item.id === action.payload);
      if (!book || book.availableCopies <= 0 || state.status !== 'succeeded') return;
      book.availableCopies -= 1;
      const loan = state.borrowed.find((item) => item.bookId === book.id);
      if (loan) loan.quantity += 1;
      else state.borrowed.push({ bookId: book.id, quantity: 1 });
      state.notice = { type: 'success', message: `Đã mượn “${book.title}”. Chúc bạn đọc vui!` };
    },
    returnBook(state, action: PayloadAction<Book['id']>) {
      const book = state.items.find((item) => item.id === action.payload);
      const loan = state.borrowed.find((item) => item.bookId === action.payload);
      if (!book || !loan || loan.quantity <= 0) return;
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      if (loan.quantity === 1)
        state.borrowed = state.borrowed.filter((item) => item.bookId !== book.id);
      else loan.quantity -= 1;
      state.notice = { type: 'success', message: `Đã trả “${book.title}”. Cảm ơn bạn!` };
    },
    setNotice(state, action: PayloadAction<LibraryNotice>) {
      state.notice = action.payload;
    },
    clearNotice(state) {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Keep current loans valid if a caller explicitly refreshes the catalogue.
        state.items = action.payload.map((book) => {
          const quantity = state.borrowed.find((loan) => loan.bookId === book.id)?.quantity ?? 0;
          return { ...book, availableCopies: Math.max(0, book.availableCopies - quantity) };
        });
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Có lỗi xảy ra khi tải sách. Vui lòng thử lại.';
      });
  },
});

export const { borrowBook, returnBook, setNotice, clearNotice } = booksSlice.actions;
export default booksSlice.reducer;
