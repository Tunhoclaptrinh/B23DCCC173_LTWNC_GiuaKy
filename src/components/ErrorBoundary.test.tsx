import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function BrokenPage(): never {
  throw new Error('Route chunk unavailable');
}

test('a page failure shows recovery controls, then a new route key resets the boundary', () => {
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    const { rerender } = render(
      <ErrorBoundary key="stats">
        <BrokenPage />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Trang chưa thể hiển thị');
    expect(screen.getByRole('button', { name: 'Tải lại trang' })).toBeVisible();
    rerender(
      <ErrorBoundary key="library">
        <h1>Danh mục sách</h1>
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: 'Danh mục sách' })).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  } finally {
    errorLog.mockRestore();
  }
});
