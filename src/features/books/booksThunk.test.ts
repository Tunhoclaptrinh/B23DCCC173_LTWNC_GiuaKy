import { createAppStore } from '../../app/store';
import { fetchBooks } from './booksSlice';

describe('fetchBooks async thunk', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('transitions through pending to fulfilled with the actual API', async () => {
    const store = createAppStore();
    const request = store.dispatch(fetchBooks(false));
    expect(store.getState().books.status).toBe('loading');
    jest.advanceTimersByTime(500);
    await request;
    expect(store.getState().books.status).toBe('succeeded');
    expect(store.getState().books.items).toHaveLength(12);
  });
  test('transitions to rejected, then a successful retry clears the error', async () => {
    const store = createAppStore();
    const failed = store.dispatch(fetchBooks(true));
    jest.advanceTimersByTime(500);
    await failed;
    expect(store.getState().books.status).toBe('failed');
    expect(store.getState().books.error).toMatch('Chưa thể tải');
    const retry = store.dispatch(fetchBooks(false));
    expect(store.getState().books.error).toBeNull();
    jest.advanceTimersByTime(500);
    await retry;
    expect(store.getState().books.status).toBe('succeeded');
  });
  test('prevents duplicate requests while an API call is pending', async () => {
    const store = createAppStore();
    const first = store.dispatch(fetchBooks(false));
    const duplicate = await store.dispatch(fetchBooks(false));
    expect(fetchBooks.rejected.match(duplicate) && duplicate.meta.condition).toBe(true);
    expect(store.getState().books.status).toBe('loading');
    jest.advanceTimersByTime(500);
    await first;
    expect(store.getState().books.items).toHaveLength(12);
  });
});
