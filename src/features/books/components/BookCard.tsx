import { memo } from 'react';
import { Button, Card, Tag, Tooltip } from 'antd';
import { ArrowRightOutlined, UndoOutlined } from '@ant-design/icons';
import type { Book } from '../types';
import { CATEGORY_PRESENTATION } from '../presentation';
import { BookCover } from './BookCover';

export type BookCardProps = Readonly<{
  book: Book;
  borrowedQuantity?: number;
  onBorrow: (id: Book['id']) => void;
  onReturn: (id: Book['id']) => void;
}>;

export const BookCard = memo(function BookCard({
  book,
  borrowedQuantity = 0,
  onBorrow,
  onReturn,
}: BookCardProps) {
  const outOfStock = book.availableCopies === 0;
  const categoryClass = CATEGORY_PRESENTATION[book.category].className;
  return (
    <Card className="book-card" data-testid={`book-${book.id}`}>
      <div className={`cover-stage cover-stage-${categoryClass}`}>
        <BookCover book={book} />
        {borrowedQuantity > 0 && (
          <span className="borrowed-ribbon">Đang mượn · {borrowedQuantity}</span>
        )}
      </div>
      <div className="book-details">
        <div className="book-meta">
          <Tag className={`category-tag category-${categoryClass}`}>{book.category}</Tag>
          <span>{book.publishedYear}</span>
        </div>
        <h3 title={book.title}>{book.title}</h3>
        <p className="book-author" title={book.author}>
          {book.author}
        </p>
        <div className="book-actions">
          <span className={`stock-label${outOfStock ? ' stock-empty' : ''}`}>
            <i />
            {outOfStock ? 'Hết bản' : `Còn ${book.availableCopies} bản`}
          </span>
          <div className="book-action-buttons">
            {borrowedQuantity > 0 && (
              <Tooltip title="Trả 1 cuốn">
                <Button
                  className="return-button"
                  aria-label={`Trả ${book.title}`}
                  icon={<UndoOutlined aria-hidden="true" />}
                  onClick={() => onReturn(book.id)}
                >
                  Trả
                </Button>
              </Tooltip>
            )}
            <Button
              className="borrow-button"
              disabled={outOfStock}
              onClick={() => onBorrow(book.id)}
              icon={<ArrowRightOutlined aria-hidden="true" />}
              iconPlacement="end"
            >
              Mượn
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});
