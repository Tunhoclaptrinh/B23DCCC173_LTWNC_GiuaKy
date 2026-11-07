import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BOOK_SEEDS } from '../../../api/booksApi';
import { createAppStore } from '../../../app/store';
import { fetchBooks } from '../booksSlice';
import { BookList } from './BookList';

function prepareCatalogue(size: number) {
  const store = createAppStore();
  const books = Array.from({ length: size }, (_, index) => ({
    ...BOOK_SEEDS[0],
    id: `title-${index}`,
    title: `Title ${index}`,
    cover: { ...BOOK_SEEDS[0].cover },
  }));
  store.dispatch(fetchBooks.fulfilled(books, 'load', false));
  return { store, books };
}

describe('large book catalogues', () => {
  test('renders only 12 of 240 books, changes pages, and resets when the filter changes', async () => {
    const user = userEvent.setup();
    const { store, books } = prepareCatalogue(240);
    const { rerender } = render(
      <Provider store={store}>
        <BookList key="all" books={books} />
      </Provider>,
    );
    expect(screen.getAllByTestId(/^book-/)).toHaveLength(12);
    expect(screen.getByRole('heading', { name: 'Title 0' })).toBeVisible();
    const pagination = screen.getByRole('navigation', { name: 'Phân trang sách' });
    expect(await within(pagination).findByText('1–12 / 240 đầu sách')).toBeVisible();
    await user.click(within(within(pagination).getByTitle('2')).getByRole('button'));
    expect(within(pagination).getByTitle('2')).toHaveClass('ant-pagination-item-active');
    expect(screen.queryByRole('heading', { name: 'Title 0' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Title 12' })).toBeVisible();
    expect(screen.getAllByTestId(/^book-/)).toHaveLength(12);
    rerender(
      <Provider store={store}>
        <BookList key="CNTT" books={books.slice(0, 26)} />
      </Provider>,
    );
    expect(screen.getByRole('heading', { name: 'Title 0' })).toBeVisible();
    expect(screen.getByText('1–12 / 26 đầu sách')).toBeVisible();
    rerender(
      <Provider store={store}>
        <BookList key="all" books={books} />
      </Provider>,
    );
    expect(screen.getByText('1–12 / 240 đầu sách')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Title 0' })).toBeVisible();
  });

  test('does not show pagination for a small catalogue', () => {
    const { store, books } = prepareCatalogue(3);
    render(
      <Provider store={store}>
        <BookList books={books} />
      </Provider>,
    );
    expect(screen.getAllByTestId(/^book-/)).toHaveLength(3);
    expect(screen.queryByRole('navigation', { name: 'Phân trang sách' })).not.toBeInTheDocument();
  });
});
