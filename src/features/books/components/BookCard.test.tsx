import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BOOK_SEEDS } from '../../../api/booksApi';
import { BookCard } from './BookCard';

const book = { ...BOOK_SEEDS[0], cover: { ...BOOK_SEEDS[0].cover } };

describe('BookCard', () => {
  test('displays the title, author, category, publication year and available copies', () => {
    render(<BookCard book={book} onBorrow={jest.fn()} onReturn={jest.fn()} />);
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeVisible();
    expect(screen.getByText('Robert C. Martin', { selector: '.book-author' })).toBeVisible();
    expect(screen.getByText('CNTT')).toBeVisible();
    expect(screen.getByText('2008')).toBeVisible();
    expect(screen.getByText('Còn 5 bản')).toBeVisible();
  });
  test('clicking Mượn calls the handler once with the correct book ID', async () => {
    const user = userEvent.setup();
    const onBorrow = jest.fn();
    render(<BookCard book={book} onBorrow={onBorrow} onReturn={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Mượn' }));
    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('clean-code');
  });
  test('an out-of-stock title has a disabled borrow button and cannot invoke the handler', async () => {
    const user = userEvent.setup();
    const onBorrow = jest.fn();
    render(
      <BookCard book={{ ...book, availableCopies: 0 }} onBorrow={onBorrow} onReturn={jest.fn()} />,
    );
    const button = screen.getByRole('button', { name: 'Mượn' });
    expect(button).toBeDisabled();
    expect(screen.getByText('Hết bản')).toBeVisible();
    await user.click(button);
    expect(onBorrow).not.toHaveBeenCalled();
  });
  test('a borrowed title exposes a return action with the correct ID', async () => {
    const user = userEvent.setup();
    const onReturn = jest.fn();
    render(<BookCard book={book} borrowedQuantity={2} onBorrow={jest.fn()} onReturn={onReturn} />);
    expect(screen.getByText('Đang mượn · 2')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Trả Clean Code' }));
    expect(onReturn).toHaveBeenCalledTimes(1);
    expect(onReturn).toHaveBeenCalledWith('clean-code');
  });
});
