import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce<T>', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('keeps the previous value until exactly 300 ms have passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: '' },
    });
    rerender({ value: 'Clean Code' });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('Clean Code');
  });
  test('restarts the delay when the user continues typing', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: '' },
    });
    rerender({ value: 'Clean' });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: 'Clean Code' });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('');
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('Clean Code');
  });
  test('supports a non-string generic value and clears the timer on unmount', () => {
    const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: { page: 1 } },
    });
    rerender({ value: { page: 2 } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toEqual({ page: 2 });
    rerender({ value: { page: 3 } });
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
