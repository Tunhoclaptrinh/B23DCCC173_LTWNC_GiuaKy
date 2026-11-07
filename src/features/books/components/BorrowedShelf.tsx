import { memo, useCallback } from 'react';
import { Button, Progress, Tag } from 'antd';
import { ArrowRightOutlined, BookOutlined, CheckOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { returnBook } from '../booksSlice';
import { BORROW_LIMIT } from '../types';
import { selectBorrowedCount, selectBorrowedEntries } from '../selectors';
import { BookCover } from './BookCover';

export const BorrowedShelf = memo(function BorrowedShelf() {
  const entries = useAppSelector(selectBorrowedEntries);
  const dispatch = useAppDispatch();
  const total = useAppSelector(selectBorrowedCount);
  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
    },
    [dispatch],
  );
  return (
    <aside className="reading-column" aria-label="Tủ sách đang mượn">
      <div className="shelf-panel">
        <div className="section-title">
          <h2>Tủ sách của bạn</h2>
          <Tag>
            {total}/{BORROW_LIMIT}
          </Tag>
        </div>
        <p className="shelf-subtitle">Một khoảng nhỏ cho những điều mới.</p>
        <Progress
          percent={(total / BORROW_LIMIT) * 100}
          showInfo={false}
          strokeColor="var(--accent)"
          railColor="var(--line)"
          size="small"
        />
        {total === 0 ? (
          <div className="empty-shelf">
            <div className="empty-shelf-art" aria-hidden="true">
              <div />
              <div />
              <div />
              <span />
            </div>
            <h3>Chưa có sách đang mượn</h3>
            <p>
              Chọn một cuốn bạn thích.
              <br />
              Hành trình đọc bắt đầu từ đây.
            </p>
          </div>
        ) : (
          <div className="shelf-list">
            {entries.map(({ book, quantity }) => {
              return (
                <div className="shelf-book" key={book.id}>
                  <BookCover book={book} small />
                  <div className="shelf-book-info">
                    <h3>{book.title}</h3>
                    <span>{quantity} cuốn đang mượn</span>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleReturn(book.id)}
                      aria-label={`Trả 1 cuốn ${book.title}`}
                    >
                      Trả 1 cuốn <ArrowRightOutlined />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="shelf-limit">
          <CheckOutlined />
          <span>Mượn tối đa 3 cuốn cùng lúc</span>
        </div>
        {total > 0 && (
          <Link className="shelf-link" to="/borrowed">
            Xem sách đang mượn <ArrowRightOutlined />
          </Link>
        )}
      </div>
      <div className="reading-note">
        <BookOutlined />
        <span>MỖI NGÀY, MỘT TRANG SÁCH</span>
        <blockquote>
          Một trang sách hôm nay.
          <br />
          Một điều mới cho ngày mai.
        </blockquote>
        <p>Dành một chút thời gian cho việc đọc.</p>
      </div>
      <div className="library-footnote">
        <i />
        Tri thức luôn ở đây, chờ bạn khám phá.
      </div>
    </aside>
  );
});
