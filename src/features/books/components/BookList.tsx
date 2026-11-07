import { lazy, memo, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { Empty, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { borrowBook, returnBook } from '../booksSlice';
import type { Book } from '../types';
import { BookCard } from './BookCard';
import { selectLoanQuantities } from '../selectors';

const PAGE_SIZE = 12;
const BookPagination = lazy(() => import('./BookPagination'));
type BookListProps = Readonly<{ books: readonly Book[]; onReset?: () => void }>;

export const BookList = memo(function BookList({ books, onReset }: BookListProps) {
  const dispatch = useAppDispatch();
  const quantities = useAppSelector(selectLoanQuantities);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(books.length / PAGE_SIZE)));
  const visibleBooks = useMemo(
    () => books.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [books, currentPage],
  );
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    listRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, []);
  const handleBorrow = useCallback(
    (id: Book['id']) => {
      dispatch(borrowBook(id));
    },
    [dispatch],
  );
  const handleReturn = useCallback(
    (id: Book['id']) => {
      dispatch(returnBook(id));
    },
    [dispatch],
  );
  if (books.length === 0)
    return (
      <div className="empty-results">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <>
              <h3>Chưa tìm thấy cuốn sách phù hợp</h3>
              <p>Thử một từ khóa khác hoặc chọn lại thể loại nhé.</p>
            </>
          }
        >
          {onReset && <Button onClick={onReset}>Xóa bộ lọc</Button>}
        </Empty>
      </div>
    );
  return (
    <div ref={listRef} className="book-list">
      <div className="book-grid">
        {visibleBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            borrowedQuantity={quantities.get(book.id) ?? 0}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        ))}
      </div>
      {books.length > PAGE_SIZE && (
        <nav className="catalog-pagination" aria-label="Phân trang sách">
          <Suspense fallback={<span role="status">Đang tải phân trang...</span>}>
            <BookPagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={books.length}
              onChange={handlePageChange}
            />
          </Suspense>
        </nav>
      )}
    </div>
  );
});
