import { fetchBooksApi } from './booksApi';
import { isApiSuccess } from './types';

describe('mock books API', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('resolves successfully only after 500 ms', async () => {
    const callback = jest.fn();
    const request = fetchBooksApi().then(callback);
    jest.advanceTimersByTime(499);
    await Promise.resolve();
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    await request;
    expect(callback).toHaveBeenCalledWith({
      ok: true,
      data: expect.arrayContaining([expect.objectContaining({ id: 'clean-code' })]),
    });
  });
  test('returns the discriminated failure response when requested', async () => {
    const request = fetchBooksApi(true);
    jest.advanceTimersByTime(500);
    const response = await request;
    expect(isApiSuccess(response)).toBe(false);
    if (!isApiSuccess(response)) expect(response.error).toMatch('Vui lòng thử lại');
  });
  test('returns independent objects for each request', async () => {
    const firstRequest = fetchBooksApi();
    const secondRequest = fetchBooksApi();
    jest.advanceTimersByTime(500);
    const [first, second] = await Promise.all([firstRequest, secondRequest]);
    if (!isApiSuccess(first) || !isApiSuccess(second))
      throw new Error('Expected successful fixtures');
    expect(first.data[0]).not.toBe(second.data[0]);
    expect(first.data[0].cover).not.toBe(second.data[0].cover);
  });
});
